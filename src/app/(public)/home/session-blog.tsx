// src/components/ResponsiveComponent.tsx
"use client";

import HoverGallery from "@/components/hover-galery";

export default function SessionBlog({}) {
  return (
    <div className="h-screen w-full flex-col items-center justify-center gap-10">
      {/* Mobile */}
      <div className="flex h-full w-full bg-blue-100 md:hidden"></div>

      {/* Tablet */}
      <div className="hidden h-full w-full bg-green-100 md:flex lg:hidden"></div>

      {/* Desktop */}
      <div className="3xl:hidden bg-background hidden h-full w-full lg:flex">
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <h1 className="text-start text-8xl font-black uppercase">
            Conheça <br /> <span className="text-stroke-on">nossas </span>{" "}
            histórias
          </h1>
          {/* <p className="w-[600px] text-start">
            vivemos a arte e a cultura com as nossas mãos nas mãos de quem a
            criou e com a nossa alma que a acompanha.
          </p> */}

          <HoverGallery />
        </div>
      </div>
    </div>
  );
}
