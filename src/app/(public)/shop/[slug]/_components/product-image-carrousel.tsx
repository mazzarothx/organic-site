import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbs,
} from "@/components/io-carousel";
import Image from "next/image";

interface ProductImagesCarouselProps {
  images: {
    cover?: { secureUrl: string; assetId?: string };
    gallery: Array<{ secureUrl: string; assetId: string }>;
  };
  activeImage: string;
  currentSlide: number;
  slideCount: number;
  setCarouselApi: (api: any) => void;
  carouselApi: any;
}

export const ProductImagesCarousel = ({
  images,
  activeImage,
  currentSlide,
  slideCount,
  setCarouselApi,
  carouselApi,
}: ProductImagesCarouselProps) => (
  <div className="flex flex-col items-center">
    <div className="relative max-w-[630px]">
      <Carousel
        setApi={setCarouselApi}
        className="bg-foreground/10 rounded-3xl"
      >
        <CarouselContent>
          <CarouselItem key="active-image">
            <Image
              src={activeImage}
              width={630}
              height={630}
              alt="Imagem principal"
              className="rounded-lg"
              priority
            />
          </CarouselItem>

          {images.gallery.map((image, index) => (
            <CarouselItem key={image.assetId}>
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
            {currentSlide}/{slideCount + 1}
          </span>
          <CarouselNext variant="ghost" className="right-1 rounded-lg" />
        </div>
      </Carousel>
    </div>

    <div className="relative max-w-[500px] overflow-hidden">
      <CarouselThumbs
        images={[
          { secureUrl: activeImage, assetId: "active-image" },
          ...images.gallery,
        ]}
        currentIndex={currentSlide - 1}
        onThumbClick={(index) => carouselApi?.scrollTo(index)}
      />
    </div>
  </div>
);
