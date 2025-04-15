// src/components/ResponsiveComponent.tsx
"use client";

export default function SessionBests({}) {
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
            <span className="text-stroke-on">Os melhores </span> <br /> vestem
            organic
          </h1>
          <p className="w-[600px] text-start">
            vivemos a arte e a cultura com as nossas mãos nas mãos de quem a
            criou e com a nossa alma que a acompanha.
          </p>

          <div className="flex h-[400px] gap-5">
            <div className="h-[400px] w-[300px] -rotate-6 border bg-red-500" />
            <div className="h-[400px] w-[300px] rotate-6 border bg-red-500" />
            <div className="h-[400px] w-[300px] -rotate-6 border bg-red-500" />
            <div className="h-[400px] w-[300px] rotate-6 border bg-red-500" />
            <div className="h-[400px] w-[300px] -rotate-6 border bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
