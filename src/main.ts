import './scss/styles.scss';

import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// Проверка каталога товаров
productsModel.setItems(apiProducts.items);
console.log('[Товары] Сохранение и получение списка:', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
const secondProduct = productsModel.getItems()[1];

if (firstProduct) {
  console.log('[Товары] Получение по id:', productsModel.getItemById(firstProduct.id));
  productsModel.setPreview(firstProduct);
  console.log('[Товары] Товар предпросмотра:', productsModel.getPreview());
}

// Проверка корзины
if (firstProduct) {
  basketModel.addItem(firstProduct);
}
if (secondProduct) {
  basketModel.addItem(secondProduct);
}
if (firstProduct) {
  basketModel.addItem(firstProduct);
}

console.log('[Корзина] Товары:', basketModel.getItems());
console.log('[Корзина] Количество товаров:', basketModel.getCount());
console.log('[Корзина] Общая сумма:', basketModel.getTotal());
console.log(
  '[Корзина] Есть первый товар:',
  firstProduct ? basketModel.hasItem(firstProduct.id) : false
);

if (firstProduct) {
  basketModel.removeItem(firstProduct.id);
  console.log('[Корзина] После удаления первого товара:', basketModel.getItems());
}

basketModel.clear();
console.log('[Корзина] После очистки:', basketModel.getItems());

// Проверка покупателя
buyerModel.setData({ address: 'Москва, ул. Пушкина, д. 1' });
console.log('[Покупатель] Данные после ввода адреса:', buyerModel.getData());
console.log('[Покупатель] Валидация после ввода адреса:', buyerModel.validate());

buyerModel.setData({ payment: 'card' });
console.log(
  '[Покупатель] Валидация после выбора оплаты:',
  buyerModel.validate()
);

console.log('[Покупатель] Валидация до ввода контактов:', buyerModel.validate());

buyerModel.setData({ email: 'test@test.ru', phone: '+79990000000' });
console.log('[Покупатель] Полная валидация:', buyerModel.validate());
console.log('[Покупатель] Полные данные:', buyerModel.getData());

buyerModel.clear();
console.log('[Покупатель] После очистки:', buyerModel.getData());

// Проверка после очистки
productsModel.setPreview(null);

if (firstProduct) {
  console.log(
    '[Корзина] Есть первый товар после очистки:',
    basketModel.hasItem(firstProduct.id)
  );
}

// Проверка API
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log('[API] Каталог с сервера сохранён в модель:', productsModel.getItems());
  })
  .catch((error: unknown) => {
    console.error('[API] Ошибка получения каталога:', error);
  });
