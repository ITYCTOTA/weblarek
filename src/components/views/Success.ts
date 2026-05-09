import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ISuccessData } from '../../types';
import { formatPrice } from '../../utils/format';

export class Success extends Component<ISuccessData> {
  private readonly descriptionElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${formatPrice(value)}`;
  }
}
