# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса. Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` — принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` — поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` — главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` — в конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` — базовый адрес сервера  
`options: RequestInit` — объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` — выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` — защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления. Интерфейс `IEvents` экспортируется из этого же файла и используется во всех компонентах.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>` — хранит коллекцию подписок на события. Ключи коллекции — названия событий или регулярное выражение, значения — коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` — инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
#### IProduct

Описывает товар.

    interface IProduct {
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number | null;
    }

id — уникальный идентификатор товара.
description — текстовое описание товара.
image — путь к изображению товара.
title — название товара.
category — категория товара.
price — цена товара (null означает, что товар недоступен).

#### IBuyer

Описывает данные покупателя.

    interface IBuyer {
        payment: TPayment | null;
        email: string;
        phone: string;
        address: string;
    }

payment — выбранный способ оплаты (null, если ещё не выбран).
email — электронная почта покупателя.
phone — контактный телефон покупателя.
address — адрес доставки заказа.

#### TPayment

Описывает доступные способы оплаты.

    type TPayment = 'card' | 'cash';

card — оплата картой.
cash — оплата наличными.

#### TCategoryKey

Тип ключей для объекта категорий. Выводится автоматически из `categoryMap` в `utils/constants.ts`.

    type TCategoryKey = keyof typeof categoryMap;

#### TBuyerErrors

Описывает объект с ошибками валидации данных покупателя.

    type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

Ключи объекта соответствуют полям `IBuyer`: `payment`, `email`, `phone`, `address`. Значение — строка с сообщением об ошибке. Если ошибок нет, объект пустой.

#### IOrderRequest

Расширяет IBuyer и добавляет информацию о заказе.

    interface IOrderRequest extends IBuyer {
        payment: TPayment;
        total: number;
        items: string[];
    }

payment — способ оплаты (обязательно выбран).
total — общая сумма заказа.
items — массив идентификаторов товаров, входящих в заказ.

#### IOrderResult

Описывает объект, который возвращает сервер в ответ на успешно оформленный заказ.

    interface IOrderResult {
        id: string;
        total: number;
    }

id — идентификатор оформленного заказа.
total — подтверждённая сумма заказа.

#### IProductListResponse

Описывает объект, который возвращает сервер при запросе списка товаров каталога.

    interface IProductListResponse {
        total: number;
        items: IProduct[];
    }

total — общее количество товаров на сервере.
items — массив товаров.

#### ICard

Общий минимум данных для любой карточки товара.

    interface ICard {
        title: string;
        price: number | null;
    }

title — название товара.
price — цена товара (null означает, что товар недоступен).

#### IFormState

Описывает состояние формы.

    interface IFormState {
        valid: boolean;
        errors: string;
    }

valid — можно ли отправлять форму.
errors — текст ошибок, объединённых в одну строку.

#### TCardCatalog

Описывает данные для карточки товара в каталоге.

    type TCardCatalog = Pick<IProduct, 'title' | 'category' | 'price'> & {
        image: { src: string; alt: string };
    };

#### TCardPreview

Описывает данные для карточки товара в модальном окне подробного просмотра.

    type TCardPreview = TCardCatalog & Pick<IProduct, 'description'> & {
        buttonText: string;
        buttonDisabled: boolean;
    };

#### TCardBasket

Описывает данные для карточки товара в корзине.

    type TCardBasket = Pick<IProduct, 'title' | 'price'> & {
        index: number;
    };

### Модели данных
#### Класс Products

Хранит каталог всех товаров, доступных в приложении, а также товар, выбранный пользователем для подробного отображения.

Конструктор: constructor(events: IEvents) — принимает экземпляр брокера событий.
Поля:
private items: IProduct[] — массив всех товаров каталога. По умолчанию — пустой массив.
private preview: IProduct | null — товар, выбранный для подробного отображения. По умолчанию — null.
Методы:
setItems(items: IProduct[]): void — сохраняет переданный массив товаров в модель и генерирует событие `catalog:changed`.
getItems(): IProduct[] — возвращает массив всех товаров из модели.
getItemById(id: string): IProduct | undefined — находит и возвращает товар по его идентификатору.
setPreview(item: IProduct): void — сохраняет товар, выбранный для подробного отображения, и генерирует событие `preview:changed`.
getPreview(): IProduct | null — возвращает товар, выбранный для подробного отображения.

#### Класс Cart

Хранит товары, выбранные покупателем для покупки.

Конструктор: constructor(events: IEvents) — принимает экземпляр брокера событий.
Поля:
private items: IProduct[] — массив товаров, добавленных в корзину. По умолчанию — пустой массив.
Методы:
getItems(): IProduct[] — возвращает массив товаров, находящихся в корзине.
addItem(item: IProduct): void — добавляет товар, полученный в параметре, в массив корзины и генерирует событие `basket:changed`.
removeItem(id: string): void — удаляет товар из массива корзины по его идентификатору и генерирует событие `basket:changed`.
clear(): void — полностью очищает корзину и генерирует событие `basket:changed`.
getTotalPrice(): number — возвращает суммарную стоимость всех товаров в корзине. Товары с ценой null не учитываются.
getItemCount(): number — возвращает количество товаров в корзине.
hasItem(id: string): boolean — проверяет наличие товара в корзине по его идентификатору.

#### Класс Buyer

Хранит данные покупателя, которые тот указывает при оформлении заказа, а также занимается их валидацией.

Конструктор: constructor(events: IEvents) — принимает экземпляр брокера событий.
Поля:
private payment: TPayment | null — выбранный способ оплаты. По умолчанию — null.
private email: string — электронная почта покупателя. По умолчанию — пустая строка.
private phone: string — телефон покупателя. По умолчанию — пустая строка.
private address: string — адрес доставки. По умолчанию — пустая строка.
Методы:
setPayment(payment: TPayment): void — сохраняет выбранный способ оплаты и генерирует событие `buyer:changed`.
setEmail(email: string): void — сохраняет электронную почту покупателя и генерирует событие `buyer:changed`.
setPhone(phone: string): void — сохраняет телефон покупателя и генерирует событие `buyer:changed`.
setAddress(address: string): void — сохраняет адрес доставки и генерирует событие `buyer:changed`.
getData(): IBuyer — возвращает все данные покупателя в виде объекта IBuyer.
clear(): void — очищает все данные покупателя и генерирует событие `buyer:changed`.
validate(): TBuyerErrors — валидирует данные покупателя. Возвращает объект с ошибками. Если поле валидно, оно отсутствует в объекте. Пустой объект означает, что все поля валидны.

### Слой коммуникации
#### Класс WebLarekAPI

Отвечает за получение данных о товарах с сервера и за отправку данных о заказе на сервер.

Конструктор: constructor(api: IApi) — принимает экземпляр класса, реализующего интерфейс IApi.
Поля:
private api: IApi — экземпляр API, используемый для выполнения запросов.
Методы:
getProducts(): Promise<IProductListResponse> — выполняет GET-запрос на ендпоинт /product/ и возвращает промис с объектом, в котором находится массив товаров.
postOrder(order: IOrderRequest): Promise<IOrderResult> — выполняет POST-запрос на ендпоинт /order/, передавая в теле запроса данные о заказе, и возвращает промис с объектом, подтверждающим покупку.

### Слой представления
#### Класс Header

Шапка сайта, отображает логотип и счётчик корзины.

Конструктор: constructor(events: IEvents, container: HTMLElement) — принимает экземпляр брокера событий и корневой DOM-элемент.
Поля:
protected counterElement: HTMLElement — счётчик корзины.
protected basketButton: HTMLButtonElement — кнопка открытия корзины.
Методы:
Сеттер counter(value: number) — обновляет цифру на счётчике. При клике на кнопку корзины генерирует событие `basket:open`.

#### Класс Gallery

Каталог товаров на главной странице.

Конструктор: constructor(container: HTMLElement) — принимает корневой DOM-элемент.
Поля:
protected catalogElement: HTMLElement — контейнер для карточек.
Методы:
Сеттер catalog(items: HTMLElement[]) — принимает массив готовых DOM-элементов карточек и вставляет их в контейнер.

#### Класс Modal

Универсальное модальное окно.

Конструктор: constructor(events: IEvents, container: HTMLElement) — принимает экземпляр брокера событий и корневой DOM-элемент.
Поля:
protected closeButton: HTMLButtonElement — кнопка закрытия.
protected contentElement: HTMLElement — контейнер для контента.
Методы:
open() и close() — управляют видимостью окна.
Сеттер content(value: HTMLElement) — вставляет переданный компонент. При клике на крестик или фон генерирует событие `modal:close`.

#### Абстрактный класс Card<T extends ICard>

Базовый класс для карточек товара.

Конструктор: constructor(container: HTMLElement) — принимает корневой DOM-элемент карточки.
Поля:
protected titleElement: HTMLElement — название товара.
protected priceElement: HTMLElement — цена товара.
Методы:
Сеттеры title(value: string) и price(value: number | null) — устанавливают соответствующие поля.

#### Класс CardCatalog extends Card<TCardCatalog>

Карточка товара в каталоге.

Конструктор: constructor(container: HTMLElement, actions: ICardActions) — принимает корневой DOM-элемент и объект с обработчиком клика.
Поля:
protected imageElement: HTMLImageElement — изображение товара.
protected categoryElement: HTMLElement — категория товара.
Методы:
Сеттер image(value: { src: string; alt: string }) — устанавливает картинку.
Сеттер category(value: string) — устанавливает текст и цветовую модификацию.
Вызывает переданный обработчик onClick при клике на карточку.

#### Класс CardPreview extends Card<TCardPreview>

Карточка товара в модальном окне подробного просмотра.

Конструктор: constructor(events: IEvents, container: HTMLElement) — принимает экземпляр брокера событий и корневой DOM-элемент.
Поля:
protected imageElement: HTMLImageElement — изображение товара.
protected categoryElement: HTMLElement — категория товара.
protected descriptionElement: HTMLElement — описание товара.
protected buttonElement: HTMLButtonElement — кнопка действия.
Методы:
Сеттеры image, category, description, buttonText, buttonDisabled — устанавливают соответствующие поля.
При клике на кнопку генерирует событие `card:action`.

#### Класс CardBasket extends Card<TCardBasket>

Карточка товара в корзине.

Конструктор: constructor(container: HTMLElement, actions: ICardActions) — принимает корневой DOM-элемент и объект с обработчиком клика.
Поля:
protected indexElement: HTMLElement — порядковый номер товара в корзине.
protected deleteButton: HTMLButtonElement — кнопка удаления.
Методы:
Сеттер index(value: number) — устанавливает порядковый номер. Кнопка удаления вызывает переданный обработчик onClick.

#### Класс Basket

Содержимое корзины.

Конструктор: constructor(events: IEvents, container: HTMLElement) — принимает экземпляр брокера событий и корневой DOM-элемент.
Поля:
protected listElement: HTMLElement — список товаров.
protected totalElement: HTMLElement — итоговая стоимость.
protected buttonElement: HTMLButtonElement — кнопка оформления заказа.
Методы:
Сеттеры items, total, disabled — устанавливают соответствующие поля. Сеттер items также управляет BEM-модификатором `basket_empty` для сжатия окна при пустой корзине.
При клике на «Оформить» генерирует событие `order:open`.

#### Абстрактный класс Form<T extends IFormState>

Базовый класс для форм.

Конструктор: constructor(events: IEvents, container: HTMLFormElement) — принимает экземпляр брокера событий и корневую форму.
Поля:
protected submitButton: HTMLButtonElement — кнопка отправки.
protected errorsElement: HTMLElement — контейнер для ошибок.
Методы:
Сеттеры valid и errors — устанавливают состояние формы.
Обрабатывает событие submit и генерирует событие `${container.name}:submit`.

#### Класс OrderForm extends Form<IOrderForm>

Первая форма заказа (способ оплаты и адрес).

Конструктор: constructor(events: IEvents, container: HTMLFormElement) — принимает экземпляр брокера событий и корневую форму.
Поля:
protected cardButton: HTMLButtonElement — кнопка «Онлайн».
protected cashButton: HTMLButtonElement — кнопка «При получении».
protected addressInput: HTMLInputElement — поле ввода адреса.
Методы:
Сеттеры payment и address — устанавливают соответствующие поля.
Генерирует события `order.payment:change` и `order.address:change`.

#### Класс ContactsForm extends Form<IContactsForm>

Вторая форма заказа (email и телефон).

Конструктор: constructor(events: IEvents, container: HTMLFormElement) — принимает экземпляр брокера событий и корневую форму.
Поля:
protected emailInput: HTMLInputElement — поле ввода email.
protected phoneInput: HTMLInputElement — поле ввода телефона.
Методы:
Сеттеры email и phone — устанавливают соответствующие поля.
Генерирует события `contacts.email:change` и `contacts.phone:change`.

#### Класс Success

Окно успешного оформления заказа.

Конструктор: constructor(events: IEvents, container: HTMLElement) — принимает экземпляр брокера событий и корневой DOM-элемент.
Поля:
protected closeButton: HTMLButtonElement — кнопка закрытия.
protected descriptionElement: HTMLElement — описание с итоговой суммой.
Методы:
Сеттер total(value: number) — устанавливает итоговую сумму. Кнопка генерирует событие `success:close`.

### События

В приложении используется событийно-ориентированный подход. Все события генерируются через брокер `EventEmitter`. Согласно контракту брокера, все данные передаются в виде объектов.

`catalog:changed` — изменился массив товаров в каталоге (генерируется `Products`).
`preview:changed` — изменился товар для подробного просмотра (генерируется `Products`).
`basket:changed` — изменилось содержимое корзины (генерируется `Cart`).
`buyer:changed` — изменились данные покупателя (генерируется `Buyer`).
`card:select` — клик по карточке в каталоге (генерируется `CardCatalog`, передаёт `{ id: string }`).
`basket:open` — клик по иконке корзины (генерируется `Header`).
`order:open` — клик по «Оформить» (генерируется `Basket`).
`order.payment:change` — выбор способа оплаты (генерируется `OrderForm`).
`order.address:change` — ввод адреса (генерируется `OrderForm`).
`order:submit` — нажатие «Далее» (генерируется `OrderForm`).
`contacts.email:change` — ввод email (генерируется `ContactsForm`).
`contacts.phone:change` — ввод телефона (генерируется `ContactsForm`).
`contacts:submit` — нажатие «Оплатить» (генерируется `ContactsForm`).
`card:action` — нажатие на кнопку в превью товара (генерируется `CardPreview`).
`basket:item:remove` — нажатие на кнопку удаления в корзине (генерируется `CardBasket`, передаёт `{ id: string }`).
`success:close` — закрытие окна успешного заказа (генерируется `Success`).
`modal:close` — закрытие модального окна (генерируется `Modal`).
