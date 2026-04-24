import { IBuyer } from '../../types';

export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  private data: Partial<IBuyer> = {};

  setData(data: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  getData(): Partial<IBuyer> {
    return { ...this.data };
  }

  clear(): void {
    this.data = {};
  }

  validate(
    fields: (keyof IBuyer)[] = ['payment', 'address', 'email', 'phone']
  ): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    const messages: Record<keyof IBuyer, string> = {
      payment: 'Не выбран способ оплаты',
      address: 'Не указан адрес',
      email: 'Не указан email',
      phone: 'Не указан телефон',
    };

    for (const field of fields) {
      const value = this.data[field];

      if (field === 'payment') {
        if (!value) {
          errors.payment = messages.payment;
        }
        continue;
      }

      if (typeof value !== 'string' || !value.trim()) {
        errors[field] = messages[field];
      }
    }

    return errors;
  }
}
