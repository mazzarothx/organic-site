"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { IoBreadcrumb } from "@/components/io-breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useCurrentUser } from "@/app/(auth)/hooks/use-current-user";
import { CarouselApi } from "@/components/io-carousel";
import Quantity from "@/components/shop/quantity";
import useCart from "@/hooks/use-cart";
import { CartProduct, Product, ProductVariation } from "@/types";
import { ProductAttributes } from "./product-attributes";
import { ProductDetailsSection } from "./product-details-section";
import { ProductHighlights } from "./product-highlights";
import { ProductImagesCarousel } from "./product-image-carrousel";
import { ProductTabs } from "./product-tabs";

const emailSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface ProductPageClientProps {
  initialData: Product;
}

const ProductPageClient = ({ initialData }: ProductPageClientProps) => {
  const router = useRouter();
  const cart = useCart();
  const user = useCurrentUser();

  // Data extraction with fallbacks
  const images = useMemo(
    () => initialData.images ?? { gallery: [] },
    [initialData.images],
  );
  const variations = useMemo(
    () => initialData.variations ?? [],
    [initialData.variations],
  );
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
    { attributeId: string; subAttributeId: string }[]
  >([]);
  const [filteredVariations, setFilteredVariations] = useState(variations);
  const [currentVariation, setCurrentVariation] =
    useState<ProductVariation | null>(
      variations.length === 1 ? variations[0] : null,
    );
  const [activeImage, setActiveImage] = useState(images.cover?.secureUrl || "");
  const attributes = useMemo(
    () => initialData?.attributes || [],
    [initialData],
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
        carouselApi.scrollTo(index + 1);
      }
    },
    [carouselApi, images.gallery],
  );

  // Update active image when carousel slides
  useEffect(() => {
    if (!carouselApi) return;

    const updateActiveImageFromSlide = () => {
      const slideIndex = carouselApi.selectedScrollSnap();
      if (slideIndex === 0) {
        setActiveImage(
          currentVariation?.imageRef?.secureUrl ||
            images.cover?.secureUrl ||
            "",
        );
      } else {
        const galleryIndex = slideIndex - 1;
        if (images.gallery && images.gallery[galleryIndex]) {
          setActiveImage(images.gallery[galleryIndex].secureUrl);
        }
      }
    };

    carouselApi.on("select", updateActiveImageFromSlide);
    return () => {
      carouselApi.off("select", updateActiveImageFromSlide);
    };
  }, [carouselApi, currentVariation, images]);

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
      price: currentVariation.salePrice || currentVariation.price,
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
  const handleSubAttributeChange = (
    attributeId: string,
    subAttributeId: string,
    isSelected: boolean,
  ) => {
    setSelectedSubAttributes((prev) => {
      const filtered = prev.filter((item) => item.attributeId !== attributeId);

      if (isSelected) {
        return [...filtered, { attributeId, subAttributeId }];
      }
      return filtered;
    });
  };

  // Variation filtering
  useEffect(() => {
    setFilteredVariations(variations);

    if (selectedSubAttributes.length === 0) {
      setCurrentVariation(variations.length === 1 ? variations[0] : null);
      setActiveImage(images.cover?.secureUrl || "");
      return;
    }

    const selectionsByAttribute = selectedSubAttributes.reduce(
      (acc, selection) => {
        if (!acc[selection.attributeId]) {
          acc[selection.attributeId] = [];
        }
        acc[selection.attributeId].push(selection.subAttributeId);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const filtered = variations.filter((variation) => {
      return Object.entries(selectionsByAttribute).every(
        ([attributeId, subAttributeIds]) => {
          return variation.attributes.some((attr) => {
            return (
              attr.attributeId === attributeId &&
              attr.subAttributes.some((subAttr) =>
                subAttributeIds.includes(subAttr.subAttributeId),
              )
            );
          });
        },
      );
    });

    setFilteredVariations(filtered);

    if (filtered.length === 1) {
      setCurrentVariation(filtered[0]);
      setActiveImage(
        filtered[0].imageRef?.secureUrl || images.cover?.secureUrl || "",
      );
      if (filtered[0].imageRef?.assetId) {
        scrollToImage(filtered[0].imageRef.assetId);
      }
    } else {
      const colorAttr = selectedSubAttributes.find(
        (attr) =>
          attributes.find((a) => a.id === attr.attributeId)?.productPageType ===
          "COLOR",
      );

      if (colorAttr) {
        const match = variations.find((variation) =>
          variation.attributes.some(
            (attr) =>
              attr.attributeId === colorAttr.attributeId &&
              attr.subAttributes.some(
                (subAttr) =>
                  subAttr.subAttributeId === colorAttr.subAttributeId,
              ),
          ),
        );

        if (match?.imageRef?.secureUrl) {
          setActiveImage(match.imageRef.secureUrl);
          if (match.imageRef.assetId) {
            scrollToImage(match.imageRef.assetId);
          }
        } else {
          setActiveImage(images.cover?.secureUrl || "");
        }
      } else {
        setActiveImage(images.cover?.secureUrl || "");
      }

      setCurrentVariation(null);
    }
  }, [
    selectedSubAttributes,
    variations,
    images.cover?.secureUrl,
    scrollToImage,
  ]);

  // Early returns
  if (!initialData) return null;
  if (!images.gallery || images.gallery.length === 0) return null;

  if (!attributes || attributes.length === 0) {
    return <div>Nenhum atributo disponível</div>;
  }

  // Price display logic
  const displayPrice =
    currentVariation?.salePrice ||
    currentVariation?.price ||
    variations[0]?.price;
  const originalPrice = currentVariation?.price || variations[0]?.price;
  const hasDiscount =
    currentVariation?.salePrice &&
    currentVariation.salePrice !== currentVariation.price;

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
          <ProductImagesCarousel
            images={images}
            activeImage={activeImage}
            currentSlide={currentSlide}
            slideCount={slideCount}
            setCarouselApi={setCarouselApi}
            carouselApi={carouselApi}
          />

          {/* Product Details */}
          <div className="flex w-full max-w-[500px] flex-col gap-4 p-8">
            <ProductDetailsSection
              name={initialData.name}
              price={displayPrice}
              originalPrice={originalPrice}
              hasDiscount={Boolean(hasDiscount)}
            />

            <Separator className="border border-dashed bg-transparent" />

            {/* Attributes */}
            <div className="mt-4 flex flex-col gap-7">
              <ProductAttributes
                attributes={attributes}
                variations={variations}
                selectedSubAttributes={selectedSubAttributes}
                onChange={handleSubAttributeChange}
              />

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
        <ProductTabs
          description={initialData.description || "Descrição não disponível"}
        />
      </div>
    </div>
  );
};

export default ProductPageClient;
