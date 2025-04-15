// src/components/ResponsiveComponent.tsx
"use client";

import { Button } from "@/components/ui/button";
import VideoBanner from "./_components/video-banner";

export default function SessionBanner({}) {
  return (
    <div className="h-screen w-full flex-col items-center justify-center gap-10">
      {/* Mobile */}
      <div className="flex h-full w-full bg-blue-100 md:hidden"></div>

      {/* Tablet */}
      <div className="hidden h-full w-full bg-green-100 md:flex lg:hidden"></div>

      {/* Desktop */}
      <div className="3xl:hidden bg-background hidden h-full w-full lg:flex">
        <div className="relative flex h-full w-[45%] flex-col items-center justify-center gap-10">
          <div className="flex flex-col items-start justify-center gap-10">
            <h1
              className="relative z-20 bg-clip-text text-8xl font-black text-transparent uppercase"
              style={{
                backgroundImage: "url('/others/giphy.gif')",
                backgroundSize: "cover",
              }}
            >
              Musica <br />
              Cultura <br />
              estilo
            </h1>
            <p className="w-[600px]">
              vivemos a arte e a cultura com as nossas mãos nas mãos de quem a
              criou e com a nossa alma que a acompanha.
            </p>
            <div className="flex gap-5">
              <Button>Produtos</Button>
              <Button>Histórias</Button>
            </div>
          </div>
        </div>
        <div className="flex h-full w-[55%] flex-col items-center justify-center gap-10">
          <VideoBanner />
        </div>
      </div>
    </div>
  );
}
