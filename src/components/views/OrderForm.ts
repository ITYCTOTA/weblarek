import { IEvents } from '../base/Events';
import { Form } from './Form';
import { IFieldChange, IOrderFormData, IPaymentChange, TPayment } from '../../types';

export class OrderForm extends Form<IOrderFormData> {
  private readonly addressInput: HTMLInputElement;
  private readonly paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, private readonly events: IEvents) {
    super(container);

    this.addressInput = container.elements.namedItem('address') as HTMLInputElement;
    this.paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button')) as HTMLButtonElement[];

    this.addressInput.addEventListener('input', () => {
      this.events.emit<IFieldChange>('order:address', { value: this.addressInput.value });
    });

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.events.emit<IPaymentChange>('order:payment', { payment: button.name as TPayment });
      });
    });

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:next');
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }
}
