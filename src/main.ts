import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { BasketView } from './components/views/BasketView';
import { BasketCard, CatalogCard, PreviewCard } from './components/views/Card';
import { ContactsForm } from './components/views/ContactsForm';
import { Modal } from './components/views/Modal';
import { OrderForm } from './components/views/OrderForm';
import { Page } from './components/views/Page';
import { Success } from './components/views/Success';
import {
  IBuyer,
  IFieldChange,
  IOrderRequest,
  IPaymentChange,
  IProduct,
  IProductId,
} from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

type ModalState = 'preview' | 'basket' | 'order' | 'contacts' | 'success' | '';

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

let modalState: ModalState = '';
let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

const closeModal = (): void => {
  modalState = '';
  orderForm = null;
  contactsForm = null;
  modal.close();
};

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

const renderCatalogCard = (product: IProduct): HTMLElement => {
  return new CatalogCard(cloneTemplate<HTMLElement>('#card-catalog'), events).render(product);
};

const renderPreviewCard = (product: IProduct): HTMLElement => {
  const isInBasket = basketModel.hasItem(product.id);
  const isAvailable = product.price !== null;

  return new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), events).render({
    ...product,
    buttonText: isAvailable ? (isInBasket ? 'Удалить из корзины' : 'Купить') : 'Недоступно',
    buttonDisabled: !isAvailable,
  });
};

const renderBasketCard = (product: IProduct, index: number): HTMLElement => {
  return new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), events).render({
    ...product,
    index: index + 1,
  });
};

const renderBasket = (): HTMLElement => {
  const items = basketModel.getItems();

  return new BasketView(cloneTemplate<HTMLElement>('#basket'), events).render({
    items: items.map(renderBasketCard),
    total: basketModel.getTotal(),
    valid: items.length > 0,
  });
};

const getOrderFormData = () => {
  const buyer = buyerModel.getData();
  const status = getFormStatus(['payment', 'address']);

  return {
    payment: buyer.payment,
    address: buyer.address,
    ...status,
  };
};

const getContactsFormData = () => {
  const buyer = buyerModel.getData();
  const status = getFormStatus(['email', 'phone']);

  return {
    email: buyer.email,
    phone: buyer.phone,
    ...status,
  };
};

const openOrderForm = (): void => {
  orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
  contactsForm = null;
  modalState = 'order';
  modal.render({ content: orderForm.render(getOrderFormData()) });
  modal.open();
};

const openContactsForm = (): void => {
  contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
  orderForm = null;
  modalState = 'contacts';
  modal.render({ content: contactsForm.render(getContactsFormData()) });
  modal.open();
};

const openSuccess = (total: number): void => {
  orderForm = null;
  contactsForm = null;
  modalState = 'success';
  modal.render({
    content: new Success(cloneTemplate<HTMLElement>('#success'), events).render({ total }),
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
      modalState = '';
      basketModel.clear();
      buyerModel.clear();
      openSuccess(response.total);
    })
    .catch((error: unknown) => {
      const errors = ['Не удалось оформить заказ'];
      contactsForm?.render({
        ...getContactsFormData(),
        errors,
        valid: true,
      });
      console.error('[API] Ошибка оформления заказа:', error);
    });
};

events.on('products:changed', () => {
  page.render({
    catalog: productsModel.getItems().map(renderCatalogCard),
  });
});

events.on('product:previewChanged', () => {
  const product = productsModel.getPreview();

  if (!product) {
    return;
  }

  modalState = 'preview';
  modal.render({ content: renderPreviewCard(product) });
  modal.open();
});

events.on('basket:changed', () => {
  page.render({ basketCount: basketModel.getCount() });

  if (modalState === 'basket') {
    modal.render({ content: renderBasket() });
  }
});

events.on('buyer:changed', () => {
  if (modalState === 'order' && orderForm) {
    orderForm.render(getOrderFormData());
  }

  if (modalState === 'contacts' && contactsForm) {
    contactsForm.render(getContactsFormData());
  }
});

events.on<IProductId>('card:select', ({ id }) => {
  const product = productsModel.getItemById(id);

  if (product) {
    productsModel.setPreview(product);
  }
});

events.on<IProductId>('product:toggle', ({ id }) => {
  const product = productsModel.getItemById(id);

  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasItem(id)) {
    basketModel.removeItem(id);
  } else {
    basketModel.addItem(product);
  }

  modalState = '';
  modal.close();
});

events.on('basket:open', () => {
  modalState = 'basket';
  modal.render({ content: renderBasket() });
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
  const status = getFormStatus(['payment', 'address']);

  if (status.valid) {
    openContactsForm();
  } else {
    orderForm?.render(getOrderFormData());
  }
});

events.on<IFieldChange>('contacts:email', ({ value }) => {
  buyerModel.setData({ email: value });
});

events.on<IFieldChange>('contacts:phone', ({ value }) => {
  buyerModel.setData({ phone: value });
});

events.on('contacts:submit', () => {
  const status = getFormStatus(['email', 'phone']);

  if (status.valid) {
    submitOrder();
  } else {
    contactsForm?.render(getContactsFormData());
  }
});

events.on('modal:close', () => {
  closeModal();
});

events.on('success:close', () => {
  closeModal();
});

larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error: unknown) => {
    console.error('[API] Ошибка загрузки каталога:', error);
  });
