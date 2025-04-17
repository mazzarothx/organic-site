export default function Loading() {
  return (
    <div className="container mx-auto min-h-[60vh] px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Placeholder para a galeria */}
        <div className="space-y-4">
          <div className="aspect-square animate-pulse rounded-lg bg-gray-200"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded bg-gray-100"
              ></div>
            ))}
          </div>
        </div>

        {/* Placeholder para as informações */}
        <div className="space-y-6">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>

          {/* Placeholder para variações */}
          <div className="space-y-4 pt-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200"></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="h-10 w-16 animate-pulse rounded-md bg-gray-100"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder para botão */}
          <div className="mt-8 h-12 w-full animate-pulse rounded-md bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
