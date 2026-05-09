export function formatPrice(price: number | null): string {
  return price === null ? 'Бесценно' : `${price} синапсов`;
}
