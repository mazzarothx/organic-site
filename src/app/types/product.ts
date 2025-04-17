// #region ---------------- CORE TYPES ----------------

export type DateString = string; // ISO 8601 format

// #endregion

// #region ---------------- PRODUCT ----------------

export type ProductType = "VARIABLE" | "SIMPLE";
export type ProductStatus = "PUBLISHED" | "ARCHIVED";
export type ProductVisibility = "PUBLIC" | "PRIVATE";
export type AttributeDisplayType =
  | "DEFAULT"
  | "COLOR"
  | "SELECT"
  | "CHECKBOX"
  | "RATIO";

export interface ProductImage {
  assetId: string;
  secureUrl: string;
}

export interface ProductImages {
  cover: ProductImage;
  underCover: ProductImage;
  gallery: ProductImage[];
}

export interface ProductLabel {
  state: boolean;
  value: string;
}

export interface ProductProperties {
  sku: string;
  code: string;
  tags: string[];
  label: {
    new: ProductLabel;
    sale: ProductLabel;
  };
  minQuantity: number;
  multiQuantity: number;
}

export interface ShippingDimensions {
  weight: number;
  length: number;
  breadth: number;
  height: number;
}

export interface ProductAttributeValue {
  id: string;
  subAttributeId: string;
  subAttributeName: string;
}

export interface ProductAttributeAssignment {
  id: string;
  attributeId: string;
  attributeName: string;
  subAttributes: ProductAttributeValue[];
}

export interface ProductVariation {
  id: string;
  price: number;
  salePrice: number;
  quantity: number;
  imageRef: ProductImage;
  attributes: ProductAttributeAssignment[];
}

export interface ProductBase {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  status: ProductStatus;
  visibility: ProductVisibility;
  featured: boolean;
  description: string | null;
  content: string | null;
  createdAt: DateString;
  updatedAt: DateString;
}

export interface Product extends ProductBase {
  attributes: ProductAttributeAssignment[];
  images: ProductImages;
  variations: ProductVariation[];
  shipping: ShippingDimensions;
  properties: ProductProperties;
  categoryId: string | null;
  subcategoryId: string | null;
  // Relacionamentos podem ser expandidos conforme necessário
  category?: ProductCategory;
  subcategory?: ProductSubcategory;
}

// #endregion

// #region ---------------- CATEGORY ----------------

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: DateString;
  updatedAt: DateString;
  subcategories?: ProductSubcategory[];
}

export interface ProductSubcategory {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  productCategoryId: string;
  createdAt: DateString;
  updatedAt: DateString;
}

// #endregion

// #region ---------------- ATTRIBUTES ----------------

export interface ProductAttribute {
  id: string;
  slug: string;
  name: string;
  type: string;
  productPageType: AttributeDisplayType;
  filterPageType: AttributeDisplayType;
  createdAt: DateString;
  updatedAt: DateString;
  productSubAttributes?: ProductSubAttribute[];
}

export interface ProductSubAttribute {
  id: string;
  slug: string;
  name: string;
  value: string;
  productAttributeId: string;
  createdAt: DateString;
  updatedAt: DateString;
}

// #endregion

// #region ---------------- CART ----------------

export interface CartProduct {
  id: string; // ID do item no carrinho
  slug: string; // Slug do produto
  productId: string; // ID do produto
  variationId: string; // ID da variação (para produtos VARIABLE)
  subAttributes: string | null; // JSON ou string formatada com atributos
  name: string; // Nome do produto + atributos (ex: "Camiseta Branca - Tamanho M")
  image: string; // URL da imagem
  price: number; // Preço unitário
  quantity: number; // Quantidade no carrinho
  availableQuantity: number; // Quantidade disponível em estoque
  minQuantity: number; // Quantidade mínima permitida
  multiQuantity: number; // Múltiplo de quantidade permitido
  originalPrice?: number; // Preço original (para mostrar desconto)
}

export interface CartSummary {
  subtotal: number;
  discount?: number;
  shipping?: number;
  total: number;
}

export interface CartContextType {
  items: CartProduct[];
  summary: CartSummary;
  addItem: (product: Omit<CartProduct, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// #endregion

// #region ---------------- API RESPONSES ----------------

export interface ApiListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

export interface ApiSingleResponse<T> {
  data: T;
}

// #endregion
