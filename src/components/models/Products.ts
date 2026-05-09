import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Products {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(private readonly events?: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events?.emit('products:changed', { items: this.getItems() });
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setPreview(item: IProduct | null): void {
    this.preview = item;
    this.events?.emit('product:previewChanged', { product: this.preview });
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
