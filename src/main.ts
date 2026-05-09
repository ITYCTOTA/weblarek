import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { CatalogCard } from './components/views/CatalogCard';
import { ContactsForm } from './components/views/ContactsForm';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { OrderForm } from './components/views/OrderForm';
import { PreviewCard } from './components/views/PreviewCard';
import { Success } from './components/views/Success';
import {
  IBasketData,
  IBuyer,
  IContactsFormData,
  IFieldChange,
  IOrderFormData,
  IOrderRequest,
  IPaymentChange,
  IPreviewCardData,
  IProduct,
  IProductId,
} from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), () => {
  events.emit('basket:open');
});
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const previewCard = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), () => {
  events.emit('product:toggle');
});
const successView = new Success(cloneTemplate<HTMLElement>('#success'), () => {
  modal.close();
});

const getErrorsByFields = (fields: (keyof IBuyer)[]): string[] => {
  const errors = buyerModel.validate();
  return fields.reduce<string[]>((result, field) => {
    const error = errors[field];
    return error ? [...result, error] : result;
  }, []);
};

const getFormStatus = (fields: (keyof IBuyer)[]) => {
  const errors = getErrorsByFields(fields);
  return {
    errors,
    valid: errors.length === 0,
  };
};

const getOrderFormData = (): IOrderFormData => {
  const buyer = buyerModel.getData();

  return {
    payment: buyer.payment,
    address: buyer.address,
    ...getFormStatus(['payment', 'address']),
  };
};

const getContactsFormData = (): IContactsFormData => {
  const buyer = buyerModel.getData();

  return {
    email: buyer.email,
    phone: buyer.phone,
    ...getFormStatus(['email', 'phone']),
  };
};

const getBasketData = (): IBasketData => {
  const items = basketModel.getItems();

  return {
    items: items.map(renderBasketCard),
    total: basketModel.getTotal(),
    valid: items.length > 0,
  };
};

const getPreviewData = (): IPreviewCardData | null => {
  const product = productsModel.getPreview();

  if (!product) {
    return null;
  }

  const isAvailable = product.price !== null;
  const isInBasket = basketModel.hasItem(product.id);

  return {
    ...product,
    buttonText: isAvailable ? (isInBasket ? 'Удалить из корзины' : 'Купить') : 'Недоступно',
    buttonDisabled: !isAvailable,
  };
};

function renderCatalogCard(product: IProduct): HTMLElement {
  return new CatalogCard(cloneTemplate<HTMLElement>('#card-catalog'), () => {
    events.emit<IProductId>('card:select', { id: product.id });
  }).render(product);
}

function renderBasketCard(product: IProduct, index: number): HTMLElement {
  return new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), () => {
    events.emit<IProductId>('basket:remove', { id: product.id });
  }).render({
    title: product.title,
    price: product.price,
    index: index + 1,
  });
}

const renderPreview = (): void => {
  const previewData = getPreviewData();

  if (previewData) {
    previewCard.render(previewData);
  }
};

const openPreview = (): void => {
  const previewData = getPreviewData();

  if (!previewData) {
    return;
  }

  modal.render({ content: previewCard.render(previewData) });
  modal.open();
};

const openOrderForm = (): void => {
  modal.render({ content: orderForm.render() });
  modal.open();
};

const openContactsForm = (): void => {
  modal.render({ content: contactsForm.render() });
  modal.open();
};

const openSuccess = (total: number): void => {
  modal.render({
    content: successView.render({ total }),
  });
  modal.open();
};

const getOrderRequest = (): IOrderRequest | null => {
  const buyer = buyerModel.getData();

  if (!buyer.payment) {
    return null;
  }

  return {
    payment: buyer.payment,
    email: buyer.email,
    phone: buyer.phone,
    address: buyer.address,
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotal(),
  };
};

const submitOrder = (): void => {
  const order = getOrderRequest();

  if (!order) {
    return;
  }

  larekApi
    .createOrder(order)
    .then((response) => {
      basketModel.clear();
      buyerModel.clear();
      openSuccess(response.total);
    })
    .catch((error: unknown) => {
      contactsForm.render({
        ...getContactsFormData(),
        errors: ['Не удалось оформить заказ'],
        valid: true,
      });
      console.error('[API] Ошибка оформления заказа:', error);
    });
};

events.on('products:changed', () => {
  gallery.render({
    items: productsModel.getItems().map(renderCatalogCard),
  });
});

events.on('product:previewChanged', () => {
  openPreview();
});

events.on('basket:changed', () => {
  header.render({ basketCount: basketModel.getCount() });
  basketView.render(getBasketData());
  renderPreview();
});

events.on('buyer:changed', () => {
  orderForm.render(getOrderFormData());
  contactsForm.render(getContactsFormData());
});

events.on<IProductId>('card:select', ({ id }) => {
  const product = productsModel.getItemById(id);

  if (product) {
    productsModel.setPreview(product);
  }
});

events.on('product:toggle', () => {
  const product = productsModel.getPreview();

  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasItem(product.id)) {
    basketModel.removeItem(product.id);
  } else {
    basketModel.addItem(product);
  }

  modal.close();
});

events.on('basket:open', () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

events.on<IProductId>('basket:remove', ({ id }) => {
  basketModel.removeItem(id);
});

events.on('order:open', () => {
  openOrderForm();
});

events.on<IPaymentChange>('order:payment', ({ payment }) => {
  buyerModel.setData({ payment });
});

events.on<IFieldChange>('order:address', ({ value }) => {
  buyerModel.setData({ address: value });
});

events.on('order:next', () => {
  openContactsForm();
});

events.on<IFieldChange>('contacts:email', ({ value }) => {
  buyerModel.setData({ email: value });
});

events.on<IFieldChange>('contacts:phone', ({ value }) => {
  buyerModel.setData({ phone: value });
});

events.on('contacts:submit', () => {
  submitOrder();
});

header.render({ basketCount: basketModel.getCount() });
basketView.render(getBasketData());

larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error: unknown) => {
    console.error('[API] Ошибка загрузки каталога:', error);
  });
