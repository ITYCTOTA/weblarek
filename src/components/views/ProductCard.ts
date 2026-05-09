import { IProductCardData } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { Card } from './Card';

export class ProductCard<T extends IProductCardData = IProductCardData> extends Card<T> {
  protected readonly categoryElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
  }

  set title(value: string) {
    super.title = value;
    this.imageElement.alt = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.remove(...Object.values(categoryMap));

    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`);
  }
}
