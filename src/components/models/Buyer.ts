import { IBuyer, BuyerValidationErrors } from '../../types';

const initialBuyerData: IBuyer = {
  payment: null,
  email: '',
  phone: '',
  address: '',
};

export class Buyer {
  private data: IBuyer = { ...initialBuyerData };

  setData(data: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  getData(): IBuyer {
    return { ...this.data };
  }

  clear(): void {
    this.data = { ...initialBuyerData };
  }

  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.data.address.trim()) {
      errors.address = 'Не указан адрес';
    }

    if (!this.data.email.trim()) {
      errors.email = 'Не указан email';
    }

    if (!this.data.phone.trim()) {
      errors.phone = 'Не указан телефон';
    }

    return errors;
  }
}
