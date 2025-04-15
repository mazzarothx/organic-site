"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { TbShieldCheckFilled } from "react-icons/tb";

import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-cart";
import {
  CartProduct,
  Product,
  ProductAttribute,
  ProductImages,
  ProductProperties,
  ProductSubAttribute,
  ProductVariation,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/legacy/image";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { toast } from "sonner";
import * as z from "zod";
import AttributeBuild from "./ui/attribute-build";
import Currency from "./ui/currency";
import Quantity from "./ui/quantity";

const emailSchema = z.object({
  email: z.string().email(),
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

  const images = initialData.images as ProductImages;
  const variations = initialData.variations as ProductVariation[];
  const properties = initialData.properties as ProductProperties;

  const user = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(images?.gallery?.length || 0);
  const [selectedSubAttributes, setSelectedSubAttributes] = useState<
    { name: string; value: string }[]
  >([]);
  const [filteredVariations, setFilteredVariations] = useState(variations);
  const [currentVariation, setCurrentVariation] =
    useState<ProductVariation | null>(null);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollToImage = useCallback(
    (assetId: string) => {
      if (!api || !images?.gallery) return;

      const index = images.gallery.findIndex(
        (image) => image.assetId === assetId,
      );
      if (index !== -1) {
        api.scrollTo(index);
      }
    },
    [api, images?.gallery],
  );

  const handleAddToCart = () => {
    if (!initialData || !currentVariation) {
      toast.error("Por favor, selecione uma variação válida do produto.");
      return;
    }

    const newCartProduct: CartProduct = {
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
      image: currentVariation.imageRef?.secureUrl || images.cover.secureUrl,
      price: currentVariation.salePrice,
      quantity: currentQuantity,
      availableQuantity: currentVariation.quantity,
      minQuantity: properties.minQuantity,
      multiQuantity: properties.multiQuantity,
    };

    cart.addItem(newCartProduct);
    toast.success("Produto adicionado ao carrinho!");
  };

  const handleQuantityIncrement = () => {
    if (currentVariation && currentQuantity < currentVariation.quantity) {
      setCurrentQuantity((prev) => prev + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (currentQuantity > 1) {
      setCurrentQuantity((prev) => prev - 1);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setSelectedSubAttributes((prev) => {
      // Encontra o atributo que está sendo modificado
      const attribute = attributes.find((attr) => attr.name === name);

      // Remove todas as seleções do mesmo atributo
      const filtered = prev.filter((item) => {
        const itemAttribute = attributes.find(
          (attr) => attr.name === item.name,
        );
        return itemAttribute?.id !== attribute?.id;
      });

      // Adiciona a nova seleção se o valor não for vazio
      return value ? [...filtered, { name, value }] : filtered;
    });
  };

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
          image: currentVariation.imageRef?.secureUrl || images.cover.secureUrl,
        },
      });
      toast.success("Avisaremos quando o produto estiver disponível!");
    } catch (error) {
      toast.error("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedSubAttributes.length) {
      setFilteredVariations(variations);
      setCurrentVariation(null);
      return;
    }

    // Filtra variações baseadas nos atributos selecionados
    const newFilteredVariations = variations.filter((variation) => {
      return selectedSubAttributes.every((selected) => {
        // Verifica se a variação contém o subatributo selecionado
        return variation.attributes.some((attr) =>
          attr.subAttributes.some(
            (subAttr) => subAttr.subAttributeId === selected.value,
          ),
        );
      });
    });

    setFilteredVariations(newFilteredVariations);

    // Se apenas uma variação corresponde, seleciona ela automaticamente
    if (newFilteredVariations.length === 1) {
      setCurrentVariation(newFilteredVariations[0]);
      if (newFilteredVariations[0].imageRef?.assetId) {
        scrollToImage(newFilteredVariations[0].imageRef.assetId);
      }
    } else {
      setCurrentVariation(null);
    }
  }, [selectedSubAttributes, variations, scrollToImage]);

  if (!initialData) return null;
  if (!images?.gallery) return null;

  return (
    <div className="flex justify-center">
      <div className="mt-32 flex max-w-[1200px] flex-col gap-6">
        <div className="w-full">
          <IoBreadcrumb title={`Produtos`} src="/shop/products" />
        </div>

        <div className="flex gap-8">
          {/* Galeria de Imagens */}
          <div className="flex flex-col items-center">
            <div className="relative max-w-[630px]">
              <Carousel
                setApi={setApi}
                className="bg-foreground/10 rounded-3xl"
              >
                <CarouselContent>
                  {images.gallery.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={image.secureUrl}
                        width={630}
                        height={630}
                        alt={`Imagem ${index + 1}`}
                        className="rounded-lg"
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
                    {current}/{count}
                  </span>
                  <CarouselNext
                    variant="ghost"
                    className="right-1 rounded-lg"
                  />
                </div>
              </Carousel>
            </div>

            {/* Miniaturas */}
            <div className="relative max-w-[500px] overflow-hidden">
              <CarouselThumbs
                images={images.gallery}
                currentIndex={current - 1}
                onThumbClick={(index) => api?.scrollTo(index)}
              />
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="flex w-full max-w-[500px] flex-col gap-4 p-8">
            <div>
              <Badge className="bg-dash-gray-800 text-dash-text-primary">
                NOVO
              </Badge>
            </div>

            <p className="text-dash-primary text-xs font-bold">EM ESTOQUE</p>
            <h1 className="text-xl font-bold">{initialData.name}</h1>

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

            <div className="flex flex-col gap-6">
              {currentVariation && currentVariation.quantity === 0 ? (
                <div>
                  <p className="text-dash-error text-xl font-bold">
                    Produto esgotado
                  </p>
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                      <div className="flex gap-4">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FloatingInput
                                  disabled={loading}
                                  placeholder="Seu e-mail"
                                  className="h-10 flex-grow"
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
                  <p className="text-dash-text-secondary text-sm">
                    Avise-me quando este produto estiver disponível novamente.
                  </p>
                </div>
              ) : (
                <>
                  {/* Preço */}
                  <div className="flex">
                    {currentVariation?.price !== currentVariation?.salePrice ? (
                      <>
                        <div className="text-dash-text-disabled mr-2 text-xl font-bold line-through">
                          <Currency
                            value={
                              currentVariation?.price || variations[0].price
                            }
                          />
                        </div>
                        <div className="text-xl font-bold">
                          <Currency
                            value={
                              currentVariation?.salePrice ||
                              variations[0].salePrice
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-xl font-bold">
                        <Currency
                          value={
                            currentVariation?.salePrice ||
                            variations[0].salePrice
                          }
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-dash-text-secondary text-sm">
                    {initialData.description}
                  </p>
                </>
              )}
            </div>

            <Separator className="border border-dashed bg-transparent" />

            {/* Atributos */}
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
                onIncrement={handleQuantityIncrement}
                onDecrement={handleQuantityDecrement}
                availableQuantity={currentVariation?.quantity || 0}
                minQuantity={properties.minQuantity}
                multiQuantity={properties.multiQuantity}
              />
            </div>

            <Separator className="border border-dashed bg-transparent" />

            <div className="mt-6 flex space-x-4">
              <Button onClick={handleAddToCart} disabled={!currentVariation}>
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>

        {/* Destaques */}
        <div className="mt-6 grid grid-cols-3 gap-24 px-24">
          <div className="flex flex-col items-center gap-4">
            <BsFillPatchCheckFill className="text-dash-primary h-6 w-6" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold">100% original</p>
              <p className="text-dash-text-secondary text-center text-sm">
                Produtos de qualidade garantida.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <FaClock className="text-dash-primary h-6 w-6" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold">10 dias para troca</p>
              <p className="text-dash-text-secondary text-center text-sm">
                Trocas fáceis e rápidas.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <TbShieldCheckFilled className="text-dash-primary h-6 w-6" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold">Garantia de 1 ano</p>
              <p className="text-dash-text-secondary text-center text-sm">
                Garantia contra defeitos.
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="w-full">
          <Tabs defaultValue="description" className="w-full">
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

export default ProductPageClient;
