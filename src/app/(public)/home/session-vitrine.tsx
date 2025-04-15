// src/app/(public)/home/session-vitrine.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Product, ProductCategory } from "@/types";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "../shop/_components/shop-card";

interface SessionVitrineProps {
  categories: ProductCategory[];
  products: Product[];
}

export default function SessionVitrine({
  categories,
  products,
}: SessionVitrineProps) {
  // Estado para controlar a categoria selecionada
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Pegar as 5 primeiras categorias (ou todas se tiver menos de 5)
  const featuredCategories = categories.slice(0, 5);

  // Função para pegar os produtos baseado na categoria selecionada
  const getProductsToShow = () => {
    if (selectedCategory) {
      return products
        .filter((product) => product.categoryId === selectedCategory)
        .slice(0, 5);
    }
    // Se nenhuma categoria está selecionada, mostra produtos de todas as categorias
    return products.slice(0, 5);
  };

  const productsToShow = getProductsToShow();

  return (
    <div className="bg-background w-full py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-center text-4xl font-black uppercase md:text-5xl lg:text-7xl">
            Conheça os nossos <br /> produtos
          </h1>
          <p className="max-w-[600px] text-center">
            vivemos a arte e a cultura com as nossas mãos nas mãos de quem a
            criou e com a nossa alma que a acompanha.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              variant={!selectedCategory ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              <button type="button">Todos</button>
            </Button>

            {featuredCategories.map((category) => (
              <Button
                key={category.id}
                asChild
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
              >
                <button type="button">{category.name}</button>
              </Button>
            ))}
          </div>

          {/* Grid de produtos */}
          <div className="mt-10 w-full space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {productsToShow.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  attributes={[]}
                />
              ))}
            </div>

            {/* Mostra mensagem se não houver produtos */}
            {productsToShow.length === 0 && (
              <p className="col-span-full text-center">
                Nenhum produto encontrado nesta categoria.
              </p>
            )}

            {/* Botão "Veja mais" */}
            <div className="flex justify-center pt-6">
              <Button asChild>
                <Link href="/shop">Veja mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
