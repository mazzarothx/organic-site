"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { FaClock as FaClockAlt } from "react-icons/fa6";
import { TbShieldCheckFilled } from "react-icons/tb";
import { toast } from "sonner";
import * as z from "zod";

// Components
import { FloatingInput } from "@/components/input-floating";
import { IoBreadcrumb } from "@/components/io-breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbs,
  type CarouselApi,
} from "@/components/io-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hooks & Utilities
import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
import useCart from "@/hooks/use-cart";
import {
  CartProduct,
  Product,
  ProductAttribute,
  ProductSubAttribute,
  ProductVariation,
} from "@/types";

// Local Components
import AttributeBuild from "./ui/attribute-build";
import Currency from "./ui/currency";
import Quantity from "./ui/quantity";

const emailSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface ProductClientProps {
  initialData: Product;
  attributes: ProductAttribute[];
  subAttributes: ProductSubAttribute[];
}

const ProductPageClient = ({
  initialData,
  attributes,
  subAttributes,
}: ProductClientProps) => {
  const router = useRouter();
  const cart = useCart();
  const user = useCurrentUser();

  // Data extraction with fallbacks
  const images = initialData.images ?? { gallery: [] };
  const variations = initialData.variations ?? [];
  const properties = initialData.properties ?? {
    minQuantity: 1,
    multiQuantity: 1,
  };

  // State management
  const [loading, setLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slideCount, setSlideCount] = useState(images.gallery?.length || 0);
  const [selectedSubAttributes, setSelectedSubAttributes] = useState<
    { name: string; value: string }[]
  >([]);
  const [filteredVariations, setFilteredVariations] = useState(variations);
  const [currentVariation, setCurrentVariation] =
    useState<ProductVariation | null>(
      variations.length === 1 ? variations[0] : null,
    );

  // Form initialization
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: user?.email ?? "" },
  });

  // Carousel controls
  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
      setSlideCount(carouselApi.scrollSnapList().length);
    };

    carouselApi.on("select", updateCarouselState);
    updateCarouselState();

    return () => {
      carouselApi.off("select", updateCarouselState);
    };
  }, [carouselApi]);

  const scrollToImage = useCallback(
    (assetId: string) => {
      if (!carouselApi || !images.gallery) return;

      const index = images.gallery.findIndex(
        (image) => image.assetId === assetId,
      );
      if (index !== -1) {
        carouselApi.scrollTo(index);
      }
    },
    [carouselApi, images.gallery],
  );

  // Cart functions
  const handleAddToCart = () => {
    if (!initialData || !currentVariation) {
      toast.error("Por favor, selecione uma variação válida do produto.");
      return;
    }

    const cartProduct: CartProduct = {
      id: currentVariation.id,
      slug: initialData.slug,
      productId: initialData.id,
      variationId: currentVariation.id,
      subAttributes: currentVariation.attributes
        .flatMap((attr) =>
          attr.subAttributes.map((subAttr) => subAttr.subAttributeName),
        )
        .join(" | "),
      name: initialData.name,
      image:
        currentVariation.imageRef?.secureUrl || images.cover?.secureUrl || "",
      price: currentVariation.salePrice,
      quantity: currentQuantity,
      availableQuantity: currentVariation.quantity,
      minQuantity: properties.minQuantity,
      multiQuantity: properties.multiQuantity,
    };

    cart.addItem(cartProduct);
    toast.success("Produto adicionado ao carrinho!");
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setCurrentQuantity((prev) => {
      if (type === "increment") {
        return currentVariation && prev < currentVariation.quantity
          ? prev + 1
          : prev;
      } else {
        return prev > 1 ? prev - 1 : prev;
      }
    });
  };

  // Attribute selection
  const handleSelectChange = (name: string, value: string) => {
    setSelectedSubAttributes((prev) => {
      const attribute = attributes.find((attr) => attr.name === name);
      const filtered = prev.filter((item) => {
        const itemAttribute = attributes.find(
          (attr) => attr.name === item.name,
        );
        return itemAttribute?.id !== attribute?.id;
      });
      return value ? [...filtered, { name, value }] : filtered;
    });
  };

  // Restock notification
  const onEmailSubmit = async (data: EmailFormValues) => {
    if (!initialData || !currentVariation) return;

    try {
      setLoading(true);
      await axios.post("/api/shop/restock-wish", {
        userId: user?.id,
        email: data.email,
        product: {
          id: initialData.id,
          name: initialData.name,
          subAttributes: currentVariation.attributes
            .flatMap((attr) =>
              attr.subAttributes.map((subAttr) => subAttr.subAttributeName),
            )
            .join(" | "),
          price: currentVariation.salePrice,
          image:
            currentVariation.imageRef?.secureUrl ||
            images.cover?.secureUrl ||
            "",
        },
      });
      toast.success("Avisaremos quando o produto estiver disponível!");
      emailForm.reset();
    } catch (error) {
      toast.error("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Variation filtering
  useEffect(() => {
    if (!selectedSubAttributes.length) {
      setFilteredVariations(variations);
      setCurrentVariation(variations.length === 1 ? variations[0] : null);
      return;
    }

    const filtered = variations.filter((variation) =>
      selectedSubAttributes.every((selected) =>
        variation.attributes.some((attr) =>
          attr.subAttributes.some(
            (subAttr) => subAttr.subAttributeId === selected.value,
          ),
        ),
      ),
    );

    setFilteredVariations(filtered);
    setCurrentVariation(filtered.length === 1 ? filtered[0] : null);

    if (filtered.length === 1 && filtered[0].imageRef?.assetId) {
      scrollToImage(filtered[0].imageRef.assetId);
    }
  }, [selectedSubAttributes, variations, scrollToImage]);

  // Early returns
  if (!initialData) return null;
  if (!images.gallery || images.gallery.length === 0) return null;

  // Price display logic
  const displayPrice = currentVariation?.salePrice ?? variations[0]?.salePrice;
  const originalPrice = currentVariation?.price ?? variations[0]?.price;
  const hasDiscount = originalPrice !== displayPrice;

  return (
    <div className="flex justify-center">
      <div className="mt-32 flex max-w-[1200px] flex-col gap-6">
        {/* Breadcrumb */}
        <div className="w-full">
          <IoBreadcrumb title="Produtos" src="/shop/products" />
        </div>

        {/* Product Content */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Image Gallery */}
          <div className="flex flex-col items-center">
            <div className="relative max-w-[630px]">
              <Carousel
                setApi={setCarouselApi}
                className="bg-foreground/10 rounded-3xl"
              >
                <CarouselContent>
                  {images.gallery.map((image, index) => (
                    <CarouselItem key={image.assetId}>
                      <Image
                        src={image.secureUrl}
                        width={630}
                        height={630}
                        alt={`${initialData.name} - Imagem ${index + 1}`}
                        className="rounded-lg"
                        priority={index === 0}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="bg-foreground/50 text-background absolute right-8 bottom-8 flex h-10 w-28 items-center justify-center rounded-xl p-3">
                  <CarouselPrevious
                    variant="ghost"
                    className="left-1 size-8 rounded-lg"
                  />
                  <span className="text-sm">
                    {currentSlide}/{slideCount}
                  </span>
                  <CarouselNext
                    variant="ghost"
                    className="right-1 rounded-lg"
                  />
                </div>
              </Carousel>
            </div>

            {/* Thumbnails */}
            <div className="relative max-w-[500px] overflow-hidden">
              <CarouselThumbs
                images={images.gallery}
                currentIndex={currentSlide - 1}
                onThumbClick={(index) => carouselApi?.scrollTo(index)}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex w-full max-w-[500px] flex-col gap-4 p-8">
            <Badge className="bg-dash-gray-800 text-dash-text-primary w-fit">
              NOVO
            </Badge>

            <p className="text-dash-primary text-xs font-bold">EM ESTOQUE</p>
            <h1 className="text-xl font-bold">{initialData.name}</h1>

            {/* Rating */}
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4].map((star) => (
                  <FaStar key={star} className="h-4 w-4 text-yellow-400" />
                ))}
                <FaStar className="text-dash-gray-600 h-4 w-4" />
              </div>
              <span className="text-dash-gray-600 ml-2 text-sm">
                (9.12k avaliações)
              </span>
            </div>

            {/* Price and Description */}
            <div className="flex flex-col gap-6">
              {currentVariation?.quantity === 0 ? (
                <OutOfStockSection
                  emailForm={emailForm}
                  loading={loading}
                  onSubmit={onEmailSubmit}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    {hasDiscount && (
                      <span className="text-dash-text-disabled text-xl font-bold line-through">
                        <Currency value={originalPrice} />
                      </span>
                    )}
                    <span className="text-xl font-bold">
                      <Currency value={displayPrice} />
                    </span>
                  </div>
                  <p className="text-dash-text-secondary text-sm">
                    {initialData.description}
                  </p>
                </>
              )}
            </div>

            <Separator className="border border-dashed bg-transparent" />

            {/* Attributes */}
            <div className="mt-4 flex flex-col gap-7">
              {attributes.map((attribute) => (
                <AttributeBuild
                  key={attribute.id}
                  attribute={attribute}
                  subAttributes={subAttributes}
                  variations={filteredVariations}
                  selectedSubAttributes={selectedSubAttributes}
                  onChange={handleSelectChange}
                />
              ))}

              <Quantity
                quantity={currentQuantity}
                onIncrement={() => handleQuantityChange("increment")}
                onDecrement={() => handleQuantityChange("decrement")}
                availableQuantity={currentVariation?.quantity || 0}
                minQuantity={properties.minQuantity}
                multiQuantity={properties.multiQuantity}
              />
            </div>

            <Separator className="border border-dashed bg-transparent" />

            {/* Add to Cart */}
            <div className="mt-6 flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={!currentVariation || currentVariation.quantity === 0}
                className="w-full"
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <ProductHighlights />

        {/* Tabs */}
        <div className="w-full">
          <Tabs defaultValue="description">
            <TabsList className="mb-10">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              {initialData.description}
            </TabsContent>
            <TabsContent value="reviews">
              Seção de avaliações dos clientes.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Extracted Components
const OutOfStockSection = ({
  emailForm,
  loading,
  onSubmit,
}: {
  emailForm: ReturnType<typeof useForm<EmailFormValues>>;
  loading: boolean;
  onSubmit: (data: EmailFormValues) => Promise<void>;
}) => (
  <div>
    <p className="text-dash-error text-xl font-bold">Produto esgotado</p>
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <FloatingInput
                    disabled={loading}
                    placeholder="Seu e-mail"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="h-10 w-24" disabled={loading}>
            {loading ? "Enviando..." : "Avise-me"}
          </Button>
        </div>
      </form>
    </Form>
    <p className="text-dash-text-secondary mt-2 text-sm">
      Avise-me quando este produto estiver disponível novamente.
    </p>
  </div>
);

const ProductHighlights = () => (
  <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-24 sm:px-24">
    {[
      {
        icon: <BsFillPatchCheckFill className="text-dash-primary h-6 w-6" />,
        title: "100% original",
        description: "Produtos de qualidade garantida.",
      },
      {
        icon: <FaClockAlt className="text-dash-primary h-6 w-6" />,
        title: "10 dias para troca",
        description: "Trocas fáceis e rápidas.",
      },
      {
        icon: <TbShieldCheckFilled className="text-dash-primary h-6 w-6" />,
        title: "Garantia de 1 ano",
        description: "Garantia contra defeitos.",
      },
    ].map((item, index) => (
      <div key={index} className="flex flex-col items-center gap-4">
        {item.icon}
        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold">{item.title}</p>
          <p className="text-dash-text-secondary text-center text-sm">
            {item.description}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default ProductPageClient;
