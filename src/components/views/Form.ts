import { Component } from '../base/Component';

export interface IFormData {
  valid: boolean;
  errors: string[];
}

export abstract class Form<T extends IFormData> extends Component<T> {
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;

  protected constructor(container: HTMLFormElement) {
    super(container);

    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsElement = container.querySelector('.form__errors') as HTMLElement;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorsElement.textContent = value.join('; ');
  }
}
