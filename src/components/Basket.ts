import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

interface IBasket {
	products: HTMLElement[];
	total: number | null;
	selected: number;
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);

		this._list = ensureElement<HTMLElement>('.basket__list', this.element);
		this._total = this.element.querySelector('.basket__price');
		this._button = this.element.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.products = [];
	}

	getElement(): HTMLElement {
		return this.element;
	}

	set selected(items: number) {
		this.setDisabled(this._button, items <= 0);
	}

	set products(products: HTMLElement[]) {
		this._list.replaceChildren(...products);
	}

	set total(total: number) {
		this.setText(this._total, `${total}` + ' синапсисов');
	}
}