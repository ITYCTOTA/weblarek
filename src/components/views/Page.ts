import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IPageData } from '../../types';

export class Page extends Component<IPageData> {
  private readonly gallery: HTMLElement;
  private readonly basketButton: HTMLButtonElement;
  private readonly basketCounter: HTMLElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.gallery = container.querySelector('.gallery') as HTMLElement;
    this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set catalog(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }

  set basketCount(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
