export type CartProduct = {
  id: string;
  slug: string;
  productId: string;
  variationId: string;
  subAttributes: string | null;
  name: string;
  image: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  minQuantity: number;
  multiQuantity: number;
};

export type CartPayment = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

export type CartDelivery = {
  id: string;
  name: string;
  price: number;
  days: string;
  icon: React.ReactNode;
};
