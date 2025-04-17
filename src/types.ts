// @/types.ts
// #region ---------------- USER ----------------

export type User = {
  id: string;
  name: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: Address | null;
  notifications: Notification | null;
  orders: Order[] | null;
  emails: UserEmailAccount[] | null;
  emailApp: UserEmailApp | null;
  about: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  status: "Active" | "Inactive" | "Banned" | "Suspended";
  role: "USER" | "ADMIN";
  isTwoFactorEnabled: boolean;
};

// #endregion

// #region ---------------- PRODUCT ----------------

// Tipos básicos para imagens
export type ProductImage = {
  assetId: string;
  secureUrl: string;
};

export type ProductImages = {
  cover: ProductImage;
  gallery: ProductImage[];
  underCover?: ProductImage;
};

// Tipos para atributos e subatributos
export type ProductSubAttribute = {
  id: string;
  subAttributeId: string;
  subAttributeName: string;
};

export type ProductAttribute = {
  id: string;
  attributeId: string;
  attributeName: string;
  type: "COLOR" | "SELECT" | "RADIO" | "TEXT";
  subAttributes: ProductSubAttribute[];
};

// Tipo para variações
export type ProductVariant = {
  price: number;
  imageRef: ProductImage;
  quantity: number;
  salePrice?: number;
  attributes: {
    id: string;
    attributeId: string;
    attributeName: string;
    subAttributes: ProductSubAttribute[];
  }[];
};

// Tipo para propriedades do produto
export type ProductProperties = {
  sku: string;
  code: string;
  tags: string[];
  label: {
    new: {
      state: boolean;
      value: string;
    };
    sale: {
      state: boolean;
      value: string;
    };
  };
  minQuantity: number;
  multiQuantity: number;
};

// Tipo base do produto
export type ProductBase = {
  id: string;
  slug: string;
  name: string;
  type: "SIMPLE" | "VARIABLE";
  status: "PUBLISHED" | "DRAFT";
  visibility: "PUBLIC" | "PRIVATE";
  featured: boolean;
  description: string;
  content: string;
  images: ProductImages;
  categoryId: string;
  subcategoryId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shipping: Record<string, any>;
  properties: ProductProperties;
  createdAt: string;
  updatedAt: string;
};

// Tipo completo do produto com variações parseadas
export type ProductWithDetails = ProductBase & {
  attributes: ProductAttribute[] | null;
  variations: ProductVariant[]; // Sempre um array, nunca string
};

// Tipo para o produto retornado pela API (pode ter variações como string)
export type ProductResponse = ProductBase & {
  attributes: ProductAttribute[] | null;
  variations: ProductVariant[] | string; // Pode vir como string JSON
};

// Tipo para seleção no frontend
export type SelectedVariant = {
  variant: ProductVariant;
  compositeKey: string; // Formato: "attribute1:value1|attribute2:value2"
};

// Tipo para o carrinho
export type CartItem = {
  product: ProductBase;
  variant?: ProductVariant;
  quantity: number;
  compositeKey?: string;
};

// #endregion

// #region ---------------- CART ----------------

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

// #endregion

// #region ---------------- PAYMENT ----------------
export type CheckoutReq = {
  userId?: string;
  address?: Address;
  paymentMethod?: CartPayment;
  deliveryMethod?: CartDelivery;
  clientInfo?: OrderClientInfo;
  coupon?: Coupon;
  products: CartProduct[];
};

export type Coupon = {
  code: string;
  discount: number;
  discountType: string;
};

export type ClientOrder = {
  id: string;
  order: number;
  userId: string | null;
  items: unknown;
  address: unknown;
  paymentDetails: unknown;
  amount: unknown;
  phone: string | null;
  clientInfo: unknown;
  status: OrderStatus;
  transitionStatus: "Completed" | "Pending";
  createdAt: Date;
};

// #endregion

// #region ---------------- SHIPPING ----------------

export type Address = {
  id: string;
  identification: string;
  default: boolean;
  fullName: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | "";
  referencia: string | "";
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
};

// export type Address = {
//   default: boolean;
//   fullName: string;
//   phone: string;
//   type: string;
//   line1: string;
//   line2: string;
//   country: string;
//   state: string;
//   city: string;
//   postal_code: string;
// };

// #endregion

// #region ---------------- UTILS ----------------

export type Notification = {
  id: string;
  image: string;
  title: string;
  message: string;
  readStatus: boolean;
  createdAt: Date;
  audioSource?: string;
  link?: string;
  onAccept?: () => void;
  onDecline?: () => void;
};

export type Mail = {
  id?: string | null;
  image?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  readStatus: boolean;
  sent: boolean;
  draft: boolean;
  deleted: boolean;
  spam: boolean;
  important: boolean;
  starred: boolean;
  archived: boolean;
  date: Date;
};
export type ZohoMail = {
  summary: string;
  sentDateInGMT: string;
  calendarType: number;
  subject: string;
  messageId: string;
  threadCount: string;
  flagid: string;
  status2: string;
  priority: string;
  hasInline: string;
  toAddress: string;
  folderId: string;
  ccAddress: string;
  threadId: string;
  hasAttachment: string;
  size: string;
  sender: string;
  receivedTime: string;
  fromAddress: string;
  status: string;
};

export type UserEmailApp = {
  currentAccountId: string;
  accounts: UserEmailAccount[];
};

export type UserEmailAccount = {
  provider?: string;
  accessToken?: string;
  refreshToken?: string;
  accountId?: string;
  emailAddress?: string;
  folders?: UserEmailFolder[];
};

export type UserEmailFolder = {
  folderId: string;
  folderName: string;
  path: string;
  isArchive: number;
};

export type EmailTab =
  | "all"
  | "inbox"
  | "sent"
  | "draft"
  | "spam"
  | "trash"
  | "archive"
  | "important"
  | "starred";

// #endregion

// #region ---------------- ORDER ----------------------------------------------

export type Order = {
  id: string;
  order: number;
  userId: string | null;
  customer: User | null;
  items: OrderItem[];
  address: Address | null;
  paymentDetails: OrderPaymentDetails | null;
  amount: OrderAmount | null;
  phone: string | null;
  clientInfo: OrderClientInfo | null;
  status: OrderStatus;
  transitionStatus: "Completed" | "Pending";
  createdAt: Date;
};

export type OrderStatus =
  | "Pending"
  | "BeingProcessed"
  | "Shipped"
  | "InTransit"
  | "Completed"
  | "OnHold"
  | "AwaitingValidation"
  | "BeingRefunded"
  | "Cancelled"
  | "Refunded";

export type OrderItem = {
  id: string;
  variationId: string;
  image: string;
  name: string;
  subAttributes: string;
  quantity: number;
  price: number;
};

export type OrderAmount = {
  amount_subtotal: number;
  discount: number;
  amount_total: number;
};

export type OrderPaymentDetails = {
  method: string;
  payment_methods: {
    card: {
      brand: string;
      funding: string;
      last4: string;
    };
  };
};

export type OrderClientInfo = {
  email: string | null;
  discord: string | null;
  characterName: string | null;
  additionalInfo: string | null;
};

// #endregion

// #region ---------------- BLOG -----------------------------------------------
export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  publish: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  imageUrl: string;
  tags: string[];
  postCategoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostCategory = {
  id: string;
  slug: string;
  name: string;
  value: string;
  Post: Post[];
  createdAt: Date;
  updatedAt: Date;
};

// #endregion
