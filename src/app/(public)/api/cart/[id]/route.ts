import { db } from "@/app/(auth)/lib/db";
import { NextResponse } from "next/server";

// GET - Retorna um carrinho específico pelo ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cart = await db.cart.findUnique({
      where: { id: params.id },
      include: { products: true },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.log("[Error in GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE - Deleta um carrinho específico pelo ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cart = await db.cart.delete({
      where: { id: params.id },
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.log("[Error in DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

interface Product {
  id: string;
  productId: string;
  variationId: string;
  name: string;
  images: string[];
  attributes: object;
  quantity: number;
}

// PATCH - Atualiza um carrinho específico pelo ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const { products, amount } = body;

    const updatedCart = await db.cart.update({
      where: { id: params.id },
      data: {
        amount,
        products: {
          upsert: products.map((product: Product) => ({
            where: { id: product.id },
            update: {
              productId: product.productId,
              variationId: product.variationId,
              name: product.name,
              images: product.images,
              attributes: product.attributes, // Tratamento correto para JSON
              quantity: product.quantity,
            },
            create: {
              productId: product.productId,
              variationId: product.variationId,
              name: product.name,
              images: product.images,
              attributes: product.attributes, // Tratamento correto para JSON
              quantity: product.quantity,
            },
          })),
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.log("[Error in PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
