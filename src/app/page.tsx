import getCategories from "@/actions/get-categories";
import { getMappedProducts } from "@/hooks/use-products";
import Paralax from "./(public)/home/paralax";
import SessionBanner from "./(public)/home/session-banner";
import SessionBests from "./(public)/home/session-bests";
import SessionBlog from "./(public)/home/session-blog";
import SessionVitrine from "./(public)/home/session-vitrine";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getMappedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <SessionBanner />
      <SessionVitrine categories={categories} products={products} />
      <SessionBests />
      <Paralax />
      <SessionBlog />
    </div>
  );
}
