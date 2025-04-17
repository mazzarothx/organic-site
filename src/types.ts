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

export type Product = {
  id: string;
  slug: string;
  name: string;

  type: "VARIABLE" | "SIMPLE";
  status: "PUBLISHED" | "ARCHIVED";
  visibility: "PUBLIC" | "PRIVATE";
  featured: boolean;

  description: string | null;
  content: string | null;
  attributes: ProductAttributeAssignment[];

  images: ProductImages;
  variations: ProductVariation[];
  shipping: Shipping;
  properties: ProductProperties;
  category: ProductCategory | null;
  subcategory: ProductSubcategory | null;

  createdAt: Date;
  updatedAt: Date;
};

export type ProductVariation = {
  id: string;
  price: number;
  salePrice: number;
  quantity: number;
  attributes: ProductAttributeAssignment[];
  imageRef: {
    assetId: string;
    secureUrl: string;
  };
};

export type ProductAttributeAssignment = {
  id: string;
  attributeId: string;
  attributeName: string;
  subAttributes: ProductSubAttributeAssignment[];
};

export type ProductSubAttributeAssignment = {
  id: string;
  subAttributeId: string;
  subAttributeName: string;
};

export type ProductAttributeCombination = {
  attributeId: string;
  subAttributeId: string;
};

export type ProductImages = {
  cover: {
    assetId: string;
    secureUrl: string;
  };
  underCover: {
    assetId: string;
    secureUrl: string;
  };
  gallery: {
    assetId: string;
    secureUrl: string;
  }[];
};

export type ProductProperties = {
  code: string;
  sku: string;
  minQuantity: number;
  multiQuantity: number;
  tags: string[];
  label: {
    sale: {
      state: boolean;
      value: string;
    };
    new: {
      state: boolean;
      value: string;
    };
  };
};

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  subcategories: ProductSubcategory[];
};

export type ProductSubcategory = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  productCategoryId: string;
};

export type ProductAttribute = {
  id: string;
  name: string;
  slug: string;
  type: string;
  productSubAttributes: ProductSubAttribute[];

  productPageType: "DEFAULT" | "COLOR" | "SELECT" | "CHECKBOX" | "RATIO";
  filterPageType: "DEFAULT" | "COLOR" | "SELECT" | "CHECKBOX" | "RATIO";

  createdAt: Date;
  updatedAt: Date;
};

export type ProductSubAttribute = {
  id: string;
  slug: string;
  name: string;
  value: string;
  productAttributeId: string;

  createdAt: Date;
  updatedAt: Date;
};

export type Shipping = {
  weight: number;
  length: number;
  breadth: number;
  height: number;
};

export type Review = {
  id: string;
  name: string;
  image?: string;
  platform: string;
  rating: number;
  comment: string;
  link?: string;
  date: Date;
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

// #region ---------------- TOOLS -----------------------------------------------

export type FormData = {
  key: string;
  title: string;
  value: string;
  label: string;
};

// #endregion
