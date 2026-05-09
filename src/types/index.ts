export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
} 

export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface ICardData {
  title: string;
  price: number | null;
}

export interface IProductCardData extends ICardData {
  category: string;
  image: string;
}

export interface IPreviewCardData extends IProductCardData {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export interface IBasketCardData extends ICardData {
  index: number;
}

export interface IGalleryData {
  items: HTMLElement[];
}

export interface IHeaderData {
  basketCount: number;
}

export interface IModalData {
  content: HTMLElement;
}

export interface IBasketData {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

export interface IFormData {
  valid: boolean;
  errors: string[];
}

export interface IOrderFormData extends IFormData {
  payment: TPayment | null;
  address: string;
}

export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export interface ISuccessData {
  total: number;
}

export interface IProductId {
  id: string;
}

export interface IFieldChange {
  value: string;
}

export interface IPaymentChange {
  payment: TPayment;
}
