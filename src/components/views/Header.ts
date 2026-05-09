import { Component } from '../base/Component';
import { IHeaderData } from '../../types';

export class Header extends Component<IHeaderData> {
  private readonly basketButton: HTMLButtonElement;
  private readonly basketCounter: HTMLElement;

  constructor(container: HTMLElement, private readonly onBasketOpen: () => void) {
    super(container);

    this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;

    this.basketButton.addEventListener('click', () => {
      this.onBasketOpen();
    });
  }

  set basketCount(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
