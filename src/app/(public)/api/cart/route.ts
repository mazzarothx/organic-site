import { db } from "@/app/(auth)/lib/db";
import { NextResponse } from "next/server";

// GET - Retorna todos os carrinhos
export async function GET(req: Request) {
  try {
    const carts = await db.cart.findMany({
      include: {
        products: true,
      },
    });
    return NextResponse.json(carts);
  } catch (error) {
    console.log("[Error in GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST - Cria um novo carrinho
interface Product {
  id: string;
  productId: string;
  variationId: string;
  name: string;
  images: string[];
  attributes: object;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { products, amount } = body;

    if (!amount) return new NextResponse("Amount is required", { status: 400 });
    if (!products || products.length === 0)
      return new NextResponse("Products are required", { status: 400 });

    const newCart = await db.cart.create({
      data: {
        amount,
        products: {
          create: products.map((product: Product) => ({
            productId: product.productId,
            variationId: product.variationId,
            name: product.name,
            images: product.images,
            attributes: product.attributes, // Tratamento correto para JSON
            quantity: product.quantity,
          })),
        },
      },
    });

    return NextResponse.json(newCart);
  } catch (error) {
    console.log("[Error in POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
