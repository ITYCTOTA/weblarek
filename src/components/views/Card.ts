import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProductCardData, IProductId } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { formatPrice } from '../../utils/format';

export class Card extends Component<IProductCardData> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;
  protected readonly categoryElement?: HTMLElement;
  protected readonly imageElement?: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
    this.categoryElement = container.querySelector('.card__category') as HTMLElement | undefined;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement | undefined;
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.titleElement.textContent = value;

    if (this.imageElement) {
      this.imageElement.alt = value;
    }
  }

  set price(value: number | null) {
    this.priceElement.textContent = formatPrice(value);
  }

  set category(value: string) {
    if (!this.categoryElement) {
      return;
    }

    this.categoryElement.textContent = value;
    this.categoryElement.classList.remove(...Object.values(categoryMap));

    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, `${CDN_URL}${value}`);
    }
  }
}

export class CatalogCard extends Card {
  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.container.addEventListener('click', () => {
      this.events.emit<IProductId>('card:select', { id: this.container.dataset.id || '' });
    });
  }
}

export class PreviewCard extends Card {
  private readonly textElement: HTMLElement;
  private readonly buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.textElement = container.querySelector('.card__text') as HTMLElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

    this.buttonElement.addEventListener('click', () => {
      this.events.emit<IProductId>('product:toggle', { id: this.container.dataset.id || '' });
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

export class BasketCard extends Card {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit<IProductId>('basket:remove', { id: this.container.dataset.id || '' });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
