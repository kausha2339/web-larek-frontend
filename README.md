# Проектная работа "Веб-ларек" 
 
https://github.com/kausha2339/web-larek-frontend.git 
 
Стек: HTML, SCSS, TS, Webpack 
 
Структура проекта: 
- src/ — исходные файлы проекта 
- src/components/ — папка с JS компонентами 
- src/components/base/ — папка с базовым кодом 
 
Важные файлы: 
- src/pages/index.html — HTML-файл главной страницы 
- src/types/index.ts — файл с типами 
- src/index.ts — точка входа приложения 
- src/scss/styles.scss — корневой файл стилей 
- src/utils/constants.ts — файл с константами 
- src/utils/utils.ts — файл с утилитами 
 
## Установка и запуск 
Для установки и запуска проекта необходимо выполнить команды 
 
``` 
npm install 
npm run start 
``` 
 
или 
 
``` 
yarn 
yarn start 
``` 
## Сборка 
 
``` 
npm run build 
``` 
 
или 
 
``` 
yarn build 
``` 
 
# Архитектура приложения 
 
Архитектура нашего приложения построена по принципу MVP (Model-View-Presenter), где код разделен на три основных компонента: модель (отвечает за данные), представление (интерфейс пользователя) и презентер (бизнес-логика). Все взаимодействия внутри системы осуществляются через события: модели генерируют события, слушатели в основном коде обрабатывают их, передавая данные компонентам отображения, выполняя необходимые вычисления и обновляя значения в моделях. 
 
 
## Базовые классы приложения: 
 
### Класс Api - этот класс отвечает за отправку запросов на сервер. В его конструкторе принимаются базовый адрес сервера и опциональный объект с заголовками запросов. 
 Конструктор: 
   constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально). 
  
Основные Методы: 
- get(uri: string) - выполняет GET-запрос к указанному эндпоинту и возвращает промис с объектом ответа от сервера. 
post(uri: string, data: object, method: ApiPostMethods = 'POST') -  отправляет данные в формате JSON на заданный эндпоинт с использованием указанного метода (по умолчанию POST). 
 
- handleResponse(response: Response) - защищенный метод, обрабатывающий ответ сервера; возвращает объект в формате JSON при успехе или статус и текст ошибки при неудаче. 
 
### Класс EventEmitter - реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 
 Конструктор: 
 constructor() { 
        this._events = new Map<EventName, Set<Subscriber>>(); 
    } 
 
Основные методы, реализуемые классом описаны интерфейсом IEvents: 
- on(eventName: EventName, callback: (event: T) => void) - добавляем обработчик на определенное событие.  
- off(eventName: EventName, callback: Subscriber) - удаляем обработчик с определенного события.  
- emit(eventName: string, data?: T) - инициирует событие с передачей данных(опционально).  
- onAll(callback: (event: EmitterEvent) => void) - слушать все события.  
- offAll() - удалить все обработчики событий trigger(eventName: string, context?: Partial<T>) - возвращает функцию, генерирующую событие при вызове 
 
### Класс Component - базовый класс для представлений, использующий дженерики. Принимает в конструкторе HTML-элемент, который будет наполняться данными из модели. 
 
Основные методы: 
- toggleClass(element: HTMLElement, className: string, force?: boolean). Параметры: элемент разметки, класс для - toggle, необязательный параметр типа boolean для переключения toggle только в одном направлении 
 
- setText(element: HTMLElement, value: unknown) - установить текст элементу 
 
- setDisabled(element: HTMLElement, state: boolean) - установить (снять) атрибут disabled. 
Параметры: элемент разметки, boolean флаг, в зависимости от которого будет устанавливаться или сниматься атрибут 
 
- setHidden(element: HTMLElement) - скрыть элемент 
 
- setVisible(element: HTMLElement) - показать элемент 
 
- setImage(element: HTMLImageElement, src: string, alt?: string) - установить изображение элементу с альтернативным текстом (если он передан) 
 
- render(data?: Partial<T>) - возвращает элемент с заполненными данными. Принимает необязательный параметр data с полями указанного ранее типа данных. 
 
 
### Класс Model - родительский класс для моделей данных, также использует дженерики. 
Конструктор: 
constructor(data: Partial<T>, protected events: IEvents) - принимает данные выбранного нами типа(возможно неполные) и экземпляр IEvents для работы с событиями 
 
 Основные методы: 
- emitChanges(event: string, payload?: object) - сообщает всем, что модель изменилась, принимает на вход событие и данные, которые изменились 
 
### Слой данных 
 
### Класс AppData - расширяет класс Model и отвечает за хранение данных приложения. Все поля являются приватными и доступны через специальные методы. 
Конструктор: 
 constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[], basket: IProduct[], order: IOrder) 
 
В полях класса хранятся следующие данные: 
- products: IProduct[] - массив объектов продуктов (товаров) 
- basket: IProduct[] - массив товаров в корзине 
- order: IOrder - заказ 
- selectedProduct: string | null - id товара для отображения в модальном окне 
 
### Также класс предоставляет набор методов для взаимодействия с этими данными. 
 
- setProducts - получаем товары для главной страницы 
- selectProduct - выбор продукта для отображения в модальном окне 
- addProductToBasket - добавление товара в корзину 
- removeProductFromBasket - удаление товара из корзины 
- getBasketProducts - получение товаров в корзине 
- getTotalPrice - получение стоимости всей корзины 
- clearBasket - очищаем корзину 
- clearOrder - очищаем текущий заказ 
- setOrderField - записываем значение в поле заказа 
- validateOrder - валидация полей заказа и установка значений ошибок, если они есть 
 
## Классы представлений: 
 
Интерфейс IModalData - представляет содержимое модального окна 
     interface IModalData { 
     content: HTMLElement - содержимое модального окна 
    } 
 
### Класс Modal - общий класс для модальных окон 
Конструктор принимает на вход HTMLElement и IEvents для работы с событиями 
 
class Modal extends Component<IModalData> { 
    closeButton: HTMLButtonElement - кнопка закрытия 
    content: HTMLElement - содержимое модального окна 
 } 
## Основные методы: 
- set content - установить содержимое модального окна 
- open - открыть модальное окно, добавляя класс видимости к container и эмитируя событие modal:open. 
- close - закрыть модальное окно, удаляя класс видимости из container, очищает содержимое и эмитирует событие modal: close. 
 
### Класс Form - общий класс для работы с формами, расширяет Component 
 Конструктор: 
 constructor(element: HTMLFormElement, protected events: IEvents) 
  
 Основные методы: 
- onInputChange - изменение значений полей ввода 
- set isButtonActive - активна ли кнопка отправки 
- set errors - установка текстов ошибок 
 
### Класс Basket - отображение корзины в модальном окне, расширяет Modal 
 
 class Basket extends Modal { 
   private basket: IProduct[] - список продуктов в корзине 
   private total: number | null - сумма покупок 
 } 
 Основные методы: 
 - set basket - установить список продуктов в корзине 
-  set total - установить общую сумму продуктов в корзине 
 
### Класс Product - отображение продукта на главной странице: 
  class Product extends Component<IProduct>{ 
    private product: TProduct 
  } 
 
### Класс ProductModal - отображение продукта в модальном окне: 
    class ProductModal extends Modal { 
       private product: IProduct 
   } 
 
### Класс OrderForm - отображение формы заказа: 
  class OrderForm extends Modal { 
   private orderFields: Record<keyof IOrder, [value:string, error:string]> | null 
   private buttonActive: Boolean 
 } 
 
### Класс OrderResult - отображение результата заказа, расширяет Modal: 
 class OrderResult extends Modal { 
   private description: string 
   private title: string 
 } 
  Основные методы: 
  - set title - установить заголовок 
  - set description - установить описание 
  -  
  Основные события 
- products:changed - изменение списка товаров 
- basket:add-product - добавление товара в корзину 
- basket:remove-product - удаление товара из корзины 
- basket:create-order - оформление заказа 
- basket:open - открытие корзины пользователя 
- product:preview - открытие модалки с товаром 
- form:errors-changed - показ(скрытие) ошибок формы 
- order:open - открытие формы заказа 
- order:clear - очистка формы заказа 
- order:set-payment-type - выбор типа оплаты 
- modal:open - открытие модалки 
- modal:close - закрытие модалки 
 
   
# Основные типы данных и интерфейсы: 
 
## IProduct  
   Интерфейс для описания карточки товара. Этот интерфейс описывает базовую структуру объекта товара. Он  
 используется для хранения базовой информации о товаре. 
 
 interface IProduct { 
    id: string, 
    description: string, 
    image: string, 
    title: string, 
    category: ProductCategory, 
    price: number | null 
} 
 
## Категории товара 
 enum ProductCategory { 
    'софт-скил' = 'soft',  
    'другое' = 'other', 
    'дополнительное' = 'additional',  
    'кнопка' = 'button', 
    'хард-скил' = 'hard' 
} 
## IOrder 
   Интерфейс для описания заказа: 
    
    interface IOrder { 
     payment: string, 
     address: string, 
     email: string, 
     phone: string, 
     total: number | null, 
     items: TProductId[] 
  } 
   
## Тип данных ошибок в форме 
 
  type FormErrors = { 
    email?: string; 
    phone?: string; 
    address?: string; 
    payment?: string; 
 } 
 
## Тип данных для отображения товара в корзине 
 
 type TProductBasket = Pick<IProduct, 'title' | 'price'>;  
 
## Тип данных при отправке заказа на сервер 
 
  interface IOrderResult { 
    id: string 
    total: number 
    error?: string 
  } 
   
## Интерфейс модели данных 
 
interface IAppData { 
    products: IProduct[] 
    basket: IProduct[] 
    order: IOrder 
} 
