import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
  private items: IProduct[] = [];

  constructor(private readonly events?: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(item: IProduct): void {
    if (this.hasItem(item.id)) {
      return;
    }

    this.items.push(item);
    this.emitChange();
  }

  removeItem(id: string): void {
    const initialCount = this.items.length;
    this.items = this.items.filter((basketItem) => basketItem.id !== id);

    if (this.items.length !== initialCount) {
      this.emitChange();
    }
  }

  clear(): void {
    this.items = [];
    this.emitChange();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  private emitChange(): void {
    this.events?.emit('basket:changed', {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
    });
  }
}
