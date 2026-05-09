import { ProductCard } from './ProductCard';

export class CatalogCard extends ProductCard {
  constructor(container: HTMLElement, private readonly onClick: () => void) {
    super(container);

    this.container.addEventListener('click', () => {
      this.onClick();
    });
  }
}
