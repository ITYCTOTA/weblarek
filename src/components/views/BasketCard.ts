import { IBasketCardData } from '../../types';
import { Card } from './Card';

export class BasketCard extends Card<IBasketCardData> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly onDelete: () => void) {
    super(container);

    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', () => {
      this.onDelete();
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
