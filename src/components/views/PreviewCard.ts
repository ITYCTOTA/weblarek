import { IPreviewCardData } from '../../types';
import { ProductCard } from './ProductCard';

export class PreviewCard extends ProductCard<IPreviewCardData> {
  private readonly textElement: HTMLElement;
  private readonly buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly onClick: () => void) {
    super(container);

    this.textElement = container.querySelector('.card__text') as HTMLElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

    this.buttonElement.addEventListener('click', () => {
      this.onClick();
    });
  }

  set description(value: string) {
    this.textElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
