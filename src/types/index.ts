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

export interface IProductCardData extends IProduct {
  buttonText?: string;
  buttonDisabled?: boolean;
  index?: number;
}

export interface IPageData {
  catalog: HTMLElement[];
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

export interface IOrderFormData {
  payment: TPayment | null;
  address: string;
  valid: boolean;
  errors: string[];
}

export interface IContactsFormData {
  email: string;
  phone: string;
  valid: boolean;
  errors: string[];
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
