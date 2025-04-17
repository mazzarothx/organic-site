"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          Oops! Something went wrong
        </h2>
        <p className="mb-6 text-gray-600">{error.message}</p>
        <button
          onClick={() => reset()}
          className="rounded bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
