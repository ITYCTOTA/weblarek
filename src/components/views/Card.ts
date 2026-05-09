import { Component } from '../base/Component';
import { ICardData } from '../../types';
import { formatPrice } from '../../utils/format';

export class Card<T extends ICardData = ICardData> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = formatPrice(value);
  }
}
