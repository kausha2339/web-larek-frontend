import { IProduct, IOrder, IAppData, FormErrors, TOrder } from '../types';
import { Model } from './base/model';
import { IEvents } from './base/events';

export class AppData extends Model<IAppData> {
	protected _products: IProduct[] = [];
	protected _basket: IProduct[] = [];
	protected _order: IOrder;
	protected formErrors: FormErrors = {};

	constructor(
		data: Partial<IAppData>,
		events: IEvents,
		products: IProduct[],
		basket: IProduct[],
		order: IOrder
	) {
		super(data, events);
		this._products = products;
		this._basket = basket;
		this._order = order;
	}

	set products(products: IProduct[]) {
		this._products = products;
	}

	set order(order: IOrder) {
		this._order = order;
	}

	get order() {
		return this._order;
	}

	get basket() {
		return this._basket;
	}

	get products() {
		return this._products;
	}

	// Устанавливаем список продуктов
	setProducts(products: IProduct[]): void {
		this._products = products;
	}

	getProducts() {
		return this.products;
	}

	// Добавляем продукт в корзину
	addProductToBasket(product: IProduct): void {
		this._basket.push(product);
	}

	// Удаляем продукт из корзины
	removeProductFromBasket(productId: string): void {
		this._basket = this._basket.filter((product) => product.id !== productId);
	}

	// Получаем продукты в корзине
	getBasketProducts(): IProduct[] {
		return this._basket;
	}

	// Получаем общую стоимость корзины
	getTotalPrice(): number {
		return this._basket.reduce(
			(total, product) => total + (product.price || 0),
			0
		);
	}

	//Получаем продукт
	getProduct(cardId: string) {
		return this._products.find((item) => item.id === cardId);
	}

	getBasket() {
		return this.basket;
	}

	// Очищаем корзину
	clearBasket(): void {
		this._basket = [];
	}

	//Получить заказ
	getOrder() {
		return this.order;
	}

	// Очищаем текущий заказ
	clearOrder(): void {
		this.order.phone = '';
		this.order.email = '';
	}

	// Устанавливаем значение для поля заказа
	setOrderField(field: keyof TOrder, value: string) {
		this.order[field] = value;
		this.validateOrder(field);
	}

	// Валидируем поля заказа
	validateOrder(field: keyof IOrder) {
		const errors: Partial<Record<keyof IOrder, string>> = {};

		// Проверка для полей email и phone
		if (field === 'email' || field === 'phone') {
			const emailError = !this.order.email.match(/^\S+@\S+\.\S+$/)
				? 'email'
				: '';
			const phoneError = !this.order.phone.match(/^\+7\d{10}$/)
				? 'телефон'
				: '';

			if (emailError && phoneError) {
				errors.email = `Необходимо указать ${emailError} и ${phoneError}`;
			} else if (emailError) {
				errors.email = `Необходимо указать ${emailError}`;
			} else if (phoneError) {
				errors.phone = `Необходимо указать ${phoneError}`;
			}
		} else if (!this.order.address) errors.address = 'Необходимо указать адрес';
		else if (!this.order.payment)
			errors.address = 'Необходимо выбрать тип оплаты';

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}