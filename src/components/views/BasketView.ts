import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketData } from '../../types';
import { formatPrice } from '../../utils/format';

export class BasketView extends Component<IBasketData> {
  private readonly listElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.listElement = container.querySelector('.basket__list') as HTMLElement;
    this.priceElement = container.querySelector('.basket__price') as HTMLElement;
    this.submitButton = container.querySelector('.basket__button') as HTMLButtonElement;

    this.submitButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.priceElement.textContent = formatPrice(value);
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
