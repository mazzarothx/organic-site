function Blog() {
  return (
    <div className="min-h-screen">
      <div className="bg-background mt-40 flex h-full w-full">
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <h1 className="text-start text-8xl font-black uppercase">
            <span className="text-stroke-on">nossas </span> histórias
          </h1>
          <p className="w-[600px] text-start">
            vivemos a arte e a cultura com as nossas mãos nas mãos de quem a
            criou e com a nossa alma que a acompanha.
          </p>

          <div className="flex h-[400px] gap-5">
            <div className="h-[400px] w-[300px] rounded-2xl border bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
