import { IApi, IOrderRequest, IOrderResponse, IProductsResponse } from '../types';

export class LarekApi {
  constructor(private readonly api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', data);
  }
}
