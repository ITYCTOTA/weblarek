import { IEvents } from '../base/Events';
import { Form } from './Form';
import { IContactsFormData, IFieldChange } from '../../types';

export class ContactsForm extends Form<IContactsFormData> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, private readonly events: IEvents) {
    super(container);

    this.emailInput = container.elements.namedItem('email') as HTMLInputElement;
    this.phoneInput = container.elements.namedItem('phone') as HTMLInputElement;

    this.emailInput.addEventListener('input', () => {
      this.events.emit<IFieldChange>('contacts:email', { value: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit<IFieldChange>('contacts:phone', { value: this.phoneInput.value });
    });

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('contacts:submit');
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
