# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с TS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

Приложение работает со следующими типами данных (`src/types/index.ts`):

### Тип TPayment
Тип доступных способов оплаты:
- `'card' | 'cash'`

### Интерфейс IProduct
Интерфейс товара:
- `id: string` — уникальный идентификатор товара.
- `description: string` — описание товара.
- `image: string` — путь к изображению товара.
- `title: string` — название товара.
- `category: string` — категория товара.
- `price: number | null` — цена товара; `null`, если товар недоступен.

### Интерфейс IBuyer
Интерфейс данных покупателя:
- `payment: TPayment | null` — выбранный способ оплаты или `null`, если способ оплаты ещё не выбран.
- `email: string` — email покупателя.
- `phone: string` — телефон покупателя.
- `address: string` — адрес доставки.

### Тип BuyerValidationErrors
Тип объекта ошибок валидации данных покупателя:
- `Partial<Record<keyof IBuyer, string>>` — объект, в котором ключами выступают поля покупателя, а значениями — тексты ошибок.

### Интерфейс IProductsResponse
Тип ответа сервера при получении каталога:
- `total: number` — количество товаров.
- `items: IProduct[]` — массив товаров.

### Интерфейс IOrderRequest
Тип данных, отправляемых на сервер при оформлении заказа:
- `payment: TPayment` — выбранный способ оплаты.
- `email: string`
- `phone: string`
- `address: string`
- `items: string[]` — массив id выбранных товаров.
- `total: number` — итоговая стоимость заказа.

### Интерфейс IOrderResponse
Тип ответа сервера после оформления заказа:
- `id: string` — идентификатор заказа.
- `total: number` — подтвержденная сумма заказа.

### Интерфейсы данных представления
Для типизации метода `render` используются отдельные интерфейсы:
- `ICardData` — общие данные карточки: `title`, `price`.
- `IProductCardData` — данные карточки товара с `category` и `image`.
- `IPreviewCardData` — данные карточки предпросмотра с `description`, `buttonText`, `buttonDisabled`.
- `IBasketCardData` — данные карточки корзины с номером позиции `index`.
- `IGalleryData` — массив DOM-элементов карточек каталога.
- `IHeaderData` — количество товаров в корзине.
- `IModalData` — содержимое модального окна.
- `IBasketData` — товары корзины, итоговая сумма и валидность кнопки оформления.
- `IFormData` — базовые данные формы: `valid`, `errors`.
- `IOrderFormData` — данные формы оплаты и адреса.
- `IContactsFormData` — данные формы email и телефона.
- `ISuccessData` — итоговая сумма успешного заказа.

## Модели данных

### Класс Products
Назначение: хранение каталога товаров и выбранного для предпросмотра товара.  
Конструктор: `constructor(events?: IEvents)` — принимает брокер событий для уведомления презентера об изменениях.

Поля:
- `items: IProduct[]` — каталог товаров.
- `preview: IProduct | null` — товар, выбранный для подробного просмотра.
- `events?: IEvents` — брокер событий.

Методы:
- `setItems(items: IProduct[]): void` — сохранить каталог товаров.
- `getItems(): IProduct[]` — получить каталог.
- `getItemById(id: string): IProduct | undefined` — получить товар по id.
- `setPreview(item: IProduct | null): void` — сохранить выбранный товар.
- `getPreview(): IProduct | null` — получить выбранный товар.

### Класс Basket
Назначение: хранение выбранных товаров и расчёт агрегированных данных корзины.  
Конструктор: `constructor(events?: IEvents)` — принимает брокер событий для уведомления презентера об изменениях.

Поля:
- `items: IProduct[]` — товары, добавленные в корзину.
- `events?: IEvents` — брокер событий.

Методы:
- `getItems(): IProduct[]` — получить товары корзины.
- `addItem(item: IProduct): void` — добавить товар (без дублей).
- `removeItem(id: string): void` — удалить товар из корзины по id.
- `clear(): void` — очистить корзину.
- `getTotal(): number` — получить суммарную стоимость корзины.
- `getCount(): number` — получить количество товаров.
- `hasItem(id: string): boolean` — проверить наличие товара в корзине по id.

### Класс Buyer
Назначение: хранение и валидация данных покупателя.
Конструктор: `constructor(events?: IEvents)` — принимает брокер событий для уведомления презентера об изменениях.

Поля:
- `data: IBuyer` — текущие данные покупателя. В начальном состоянии содержит `payment: null`, а строковые поля — пустые строки.
- `events?: IEvents` — брокер событий.

Методы:
- `setData(data: Partial<IBuyer>): void` — частично обновить данные покупателя.
- `getData(): IBuyer` — получить текущие данные.
- `clear(): void` — сбросить данные покупателя к начальному состоянию.
- `validate(): BuyerValidationErrors` — выполнить валидацию всех полей и вернуть объект ошибок.

## Слой коммуникации

### Класс LarekApi
Назначение: получение данных каталога с сервера и отправка заказа.  
Особенность: использует композицию с базовым классом `Api` через интерфейс `IApi`.

Конструктор:
- `constructor(api: IApi)` — принимает объект с методами HTTP-запросов.

Методы:
- `getProducts(): Promise<IProductsResponse>` — GET-запрос на `/product/`, получение каталога.
- `createOrder(data: IOrderRequest): Promise<IOrderResponse>` — POST-запрос на `/order/`, отправка заказа.

## Слой представления

Классы представления находятся в `src/components/views`. Представления отвечают за DOM, пользовательские действия и вызов переданных обработчиков. Данные приложения в них не хранятся: состояние каталога, корзины, выбранного товара и покупателя находится в моделях.

Все представления, кроме карточек каталога и карточек корзины, создаются один раз в `main.ts` и затем обновляются через `render`. Карточки каталога и корзины создаются заново при перерисовке соответствующих списков.

### Класс Header
Назначение: отображение шапки, кнопки корзины и счётчика товаров.  
Файл: `src/components/views/Header.ts`.  
Конструктор: `constructor(container: HTMLElement, onBasketOpen: () => void)`.

Поля:
- `basketButton: HTMLButtonElement` — кнопка открытия корзины.
- `basketCounter: HTMLElement` — счётчик товаров в корзине.
- `onBasketOpen: () => void` — обработчик открытия корзины.

Методы и сеттеры:
- `set basketCount(value: number): void` — обновить счётчик корзины.
- `render(data?: Partial<IHeaderData>): HTMLElement` — обновить отображение.

### Класс Gallery
Назначение: отображение списка карточек каталога.  
Файл: `src/components/views/Gallery.ts`.  
Конструктор: `constructor(container: HTMLElement)`.

Методы и сеттеры:
- `set items(items: HTMLElement[]): void` — заменить содержимое галереи карточками товаров.
- `render(data?: Partial<IGalleryData>): HTMLElement` — обновить отображение.

### Класс Modal
Назначение: управление модальным окном.  
Файл: `src/components/views/Modal.ts`.  
Конструктор: `constructor(container: HTMLElement)`.

Поля:
- `closeButton: HTMLButtonElement` — кнопка закрытия.
- `contentElement: HTMLElement` — контейнер содержимого.

Методы и сеттеры:
- `set content(value: HTMLElement): void` — заменить содержимое модального окна.
- `open(): void` — открыть модальное окно.
- `close(): void` — закрыть модальное окно и очистить содержимое.
- `render(data?: Partial<IModalData>): HTMLElement` — обновить отображение.

### Класс Card
Назначение: базовая карточка с полями, общими для всех карточек.  
Файл: `src/components/views/Card.ts`.  
Конструктор: `constructor(container: HTMLElement)`.

Поля:
- `titleElement: HTMLElement` — элемент названия товара.
- `priceElement: HTMLElement` — элемент цены товара.

Методы и сеттеры:
- `set title(value: string): void` — отобразить название.
- `set price(value: number | null): void` — отобразить цену.
- `render(data?: Partial<ICardData>): HTMLElement` — обновить карточку.

### Класс ProductCard
Назначение: общий родитель для карточек, у которых есть изображение и категория.  
Файл: `src/components/views/ProductCard.ts`.  
Наследуется от `Card`.

Поля:
- `categoryElement: HTMLElement` — элемент категории.
- `imageElement: HTMLImageElement` — изображение товара.

Методы и сеттеры:
- `set title(value: string): void` — отобразить название и записать его в `alt` изображения.
- `set category(value: string): void` — отобразить категорию и её CSS-модификатор.
- `set image(value: string): void` — отобразить изображение товара.
- `render(data?: Partial<IProductCardData>): HTMLElement` — обновить карточку.

### Класс CatalogCard
Назначение: карточка товара в каталоге.  
Файл: `src/components/views/CatalogCard.ts`.  
Наследуется от `ProductCard`.  
Конструктор: `constructor(container: HTMLElement, onClick: () => void)`.

Поля:
- `onClick: () => void` — обработчик выбора карточки.

Особенность: карточка не хранит id товара. Id замыкается в обработчике, который создаётся в презентере.

### Класс PreviewCard
Назначение: карточка подробного просмотра товара.  
Файл: `src/components/views/PreviewCard.ts`.  
Наследуется от `ProductCard`.  
Конструктор: `constructor(container: HTMLElement, onClick: () => void)`.

Поля:
- `textElement: HTMLElement` — описание товара.
- `buttonElement: HTMLButtonElement` — кнопка покупки или удаления.
- `onClick: () => void` — обработчик нажатия кнопки.

Методы и сеттеры:
- `set description(value: string): void` — отобразить описание.
- `set buttonText(value: string): void` — обновить текст кнопки.
- `set buttonDisabled(value: boolean): void` — включить или отключить кнопку.
- `render(data?: Partial<IPreviewCardData>): HTMLElement` — обновить карточку.

### Класс BasketCard
Назначение: карточка товара в корзине.  
Файл: `src/components/views/BasketCard.ts`.  
Наследуется от `Card`.  
Конструктор: `constructor(container: HTMLElement, onDelete: () => void)`.

Поля:
- `indexElement: HTMLElement` — номер позиции.
- `deleteButton: HTMLButtonElement` — кнопка удаления.
- `onDelete: () => void` — обработчик удаления.

Методы и сеттеры:
- `set index(value: number): void` — отобразить номер позиции.
- `render(data?: Partial<IBasketCardData>): HTMLElement` — обновить карточку.

### Класс BasketView
Назначение: отображение корзины.  
Файл: `src/components/views/BasketView.ts`.  
Конструктор: `constructor(container: HTMLElement, events: IEvents)`.

Поля:
- `listElement: HTMLElement` — список товаров.
- `priceElement: HTMLElement` — итоговая стоимость.
- `submitButton: HTMLButtonElement` — кнопка оформления.
- `events: IEvents` — брокер событий.

Методы и сеттеры:
- `set items(items: HTMLElement[]): void` — отрисовать товары корзины.
- `set total(value: number): void` — обновить итоговую стоимость.
- `set valid(value: boolean): void` — активировать или деактивировать кнопку оформления.
- `render(data?: Partial<IBasketData>): HTMLElement` — обновить отображение.

### Класс Form
Назначение: общий родитель форм оформления заказа.  
Файл: `src/components/views/Form.ts`.  
Конструктор: `constructor(container: HTMLFormElement)`.

Поля:
- `submitButton: HTMLButtonElement` — кнопка отправки формы.
- `errorsElement: HTMLElement` — контейнер ошибок.

Методы и сеттеры:
- `set valid(value: boolean): void` — управляет доступностью кнопки отправки.
- `set errors(value: string[]): void` — отображает ошибки формы.

### Класс OrderForm
Назначение: первый шаг оформления заказа: способ оплаты и адрес.  
Файл: `src/components/views/OrderForm.ts`.  
Наследуется от `Form`.  
Конструктор: `constructor(container: HTMLFormElement, events: IEvents)`.

Поля:
- `addressInput: HTMLInputElement` — поле адреса.
- `paymentButtons: HTMLButtonElement[]` — кнопки выбора способа оплаты.
- `events: IEvents` — брокер событий.

Методы и сеттеры:
- `set address(value: string): void` — отобразить адрес.
- `set payment(value: TPayment | null): void` — выделить выбранный способ оплаты.
- `render(data?: Partial<IOrderFormData>): HTMLElement` — обновить форму.

### Класс ContactsForm
Назначение: второй шаг оформления заказа: email и телефон.  
Файл: `src/components/views/ContactsForm.ts`.  
Наследуется от `Form`.  
Конструктор: `constructor(container: HTMLFormElement, events: IEvents)`.

Поля:
- `emailInput: HTMLInputElement` — поле email.
- `phoneInput: HTMLInputElement` — поле телефона.
- `events: IEvents` — брокер событий.

Методы и сеттеры:
- `set email(value: string): void` — отобразить email.
- `set phone(value: string): void` — отобразить телефон.
- `render(data?: Partial<IContactsFormData>): HTMLElement` — обновить форму.

### Класс Success
Назначение: отображение успешного оформления заказа.  
Файл: `src/components/views/Success.ts`.  
Конструктор: `constructor(container: HTMLElement, onClose: () => void)`.

Поля:
- `descriptionElement: HTMLElement` — описание списанной суммы.
- `closeButton: HTMLButtonElement` — кнопка закрытия.
- `onClose: () => void` — обработчик закрытия окна успеха.

Методы и сеттеры:
- `set total(value: number): void` — отображает списанную сумму.
- `render(data?: Partial<ISuccessData>): HTMLElement` — обновить отображение.

## События приложения

События моделей:
- `products:changed` — изменён каталог товаров.
- `product:previewChanged` — изменён товар для подробного просмотра.
- `basket:changed` — изменилось содержимое корзины.
- `buyer:changed` — изменились данные покупателя.

События пользовательских действий:
- `card:select` — пользователь выбрал карточку товара в каталоге.
- `product:toggle` — пользователь нажал кнопку покупки или удаления в карточке предпросмотра.
- `basket:open` — пользователь открыл корзину.
- `basket:remove` — пользователь удалил товар из корзины.
- `order:open` — пользователь начал оформление заказа.
- `order:payment` — пользователь выбрал способ оплаты.
- `order:address` — пользователь изменил адрес.
- `order:next` — пользователь перешёл ко второму шагу оформления.
- `contacts:email` — пользователь изменил email.
- `contacts:phone` — пользователь изменил телефон.
- `contacts:submit` — пользователь нажал кнопку оплаты.

## Презентер

Презентер реализован в `src/main.ts`, так как приложение одностраничное. Он создаёт модели, API-класс и все постоянные представления, подписывается на события и связывает слои между собой.

Особенности реализации:
- презентер не хранит локальное состояние модального окна или форм;
- выбранный товар хранится в модели `Products`;
- данные корзины хранятся в модели `Basket`;
- данные покупателя хранятся в модели `Buyer`;
- формы, модальное окно, корзина, предпросмотр товара, шапка, галерея и окно успеха создаются один раз;
- карточки каталога и карточки корзины создаются при перерисовке соответствующих списков;
- представления обновляются при событиях изменения моделей: `products:changed`, `product:previewChanged`, `basket:changed`, `buyer:changed`;
- модальное окно закрывается прямым вызовом метода `modal.close()`.

Основные обязанности презентера:
- загрузить каталог товаров через `LarekApi.getProducts()` и сохранить его в `Products`;
- при изменении каталога отрисовать карточки в `Gallery`;
- открыть модальное окно товара при выборе карточки;
- добавить выбранный товар в корзину или удалить его из корзины;
- обновлять `Header`, `BasketView` и `PreviewCard` при изменении корзины;
- обновлять `OrderForm` и `ContactsForm` при изменении данных покупателя;
- открыть формы оформления заказа без повторного создания их экземпляров;
- собрать `IOrderRequest` из моделей `Buyer` и `Basket`;
- отправить заказ через `LarekApi.createOrder()`;
- после успешного заказа очистить корзину и данные покупателя, затем показать окно успеха.
