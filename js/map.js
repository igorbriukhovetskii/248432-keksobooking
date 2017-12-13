'use strict';

var AVATAR_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var OFFER_MIN_PRICE = 1000;
var OFFER_MAX_PRICE = 1e6;
var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var OFFER_TYPES_VOCABULARY = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var OFFER_MIN_ROOM_NUMBER = 1;
var OFFER_MAX_ROOM_NUMBER = 5;
var GUESTS_MAX_NUMBER = 10;
var GUESTS_MIN_NUMBER = 1;
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PIN_X_COORDINATE_MIN = 300;
var PIN_X_COORDINATE_MAX = 900;
var PIN_Y_COORDINATE_MIN = 100;
var PIN_Y_COORDINATE_MAX = 500;
var PIN_NEEDLE_HEIGHT = 18;
var ESC_KEYCODE = 27;

/**
 * Получение случайного целого числа в заданном диапазоне
 * @param {number} maxValue - максимальное возможное число
 * @param {number} minValue - минимальное возможное число, по умолчанию равно 0
 * @return {number} - случайное целое число
 */
var getRandomInteger = function (maxValue, minValue) {
  minValue = minValue || 0;
  return Math.floor(Math.random() * (maxValue + 1 - minValue) + minValue);
};

/**
 * Получение случайного элемента массива
 * @param {Array} array
 * @return {*} - случайный элемент массива
 */
var getRandomArrayElement = function (array) {
  return array[getRandomInteger(array.length - 1, 0)];
};

/**
 * Перетасовка массива
 * @param {Array} array
 * @return {Array} shuffledArray - возвращает перетасованную копию оригинального массива
 */
var getShuffledArray = function (array) {
  var shuffledArray = array.slice();
  for (var i = shuffledArray.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * i + 1);
    var swap = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = swap;
  }
  return shuffledArray;
};

/**
 * Извлекает последний элемент массива, уменьшает исходный массив
 * @param {Array} array
 * @return {*}
 */
var extractLastArrayElement = function (array) {
  return array.splice(array.length - 1, 1);
};

/**
 * Укорачивает исходный массив на произвольное количество элементов
 * @param {Array} array
 * @return {Array} - укороченный массив
 */
var getRandomLengthArray = function (array) {
  return array.slice(getRandomInteger(array.length - 1, 1));
};

// Генерирование массива случайных объявлений
var generatePosts = function () {
  var posts = [];
  var avatarNumbers = getShuffledArray(AVATAR_NUMBERS);
  var offerTitles = getShuffledArray(OFFER_TITLES);

  // Генерация объявления
  var getPost = function () {
    var pinXcoordinate = getRandomInteger(PIN_X_COORDINATE_MAX, PIN_X_COORDINATE_MIN);
    var pinYcoordinate = getRandomInteger(PIN_Y_COORDINATE_MAX, PIN_Y_COORDINATE_MIN);

    return {
      author: {
        avatar: 'img/avatars/user' + extractLastArrayElement(avatarNumbers) + '.png'
      },
      offer: {
        title: extractLastArrayElement(offerTitles),
        address: '\'' + pinXcoordinate + ', ' + pinYcoordinate + '\'',
        price: getRandomInteger(OFFER_MAX_PRICE, OFFER_MIN_PRICE),
        type: getRandomArrayElement(OFFER_TYPES),
        rooms: getRandomInteger(OFFER_MAX_ROOM_NUMBER, OFFER_MIN_ROOM_NUMBER),
        guests: getRandomInteger(GUESTS_MAX_NUMBER, GUESTS_MIN_NUMBER),
        checkin: getRandomArrayElement(CHECKIN_TIMES),
        checkout: getRandomArrayElement(CHECKOUT_TIMES),
        features: getRandomLengthArray(getShuffledArray(OFFER_FEATURES)),
        description: '',
        photos: []
      },
      location: {
        x: getRandomInteger(PIN_X_COORDINATE_MAX, PIN_X_COORDINATE_MIN),
        y: getRandomInteger(PIN_Y_COORDINATE_MAX, PIN_Y_COORDINATE_MIN)
      }
    };
  };

  for (var i = 0; i < AVATAR_NUMBERS.length; i++) {
    posts.push(getPost());
  }

  return posts;
};

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');

/**
 * Подготовка нового указателя на карте по шаблону
 * @param {Object} post - элемент сгенерированного массива случайных объявлений
 * @param {number} index - индекс указателя, соответствует индексу объявления в массиве случайных объявлений
 * @return {Node} - подготовленный к вставке указатель (пин) на карте
 */
var renderMapPin = function (post, index) {
  var mapPin = pinTemplate.cloneNode(true);
  var mapPinImage = mapPin.querySelector('img');
  var pinOffsetX = mapPinImage.getAttribute('width') / 2;
  var pinOffsetY = parseInt(mapPinImage.getAttribute('height'), 10) + PIN_NEEDLE_HEIGHT;

  mapPin.style.left = post.location.x - pinOffsetX + 'px';
  mapPin.style.top = post.location.y - pinOffsetY + 'px';
  mapPinImage.src = post.author.avatar;
  mapPin.dataset.index = index;

  return mapPin;
};

var cardTemplate = template.content.querySelector('.map__card');

/**
 * Подготовка карточки объявления по шаблону
 * @param {Object} post - элемент сгенерированного массива случайных объявлений
 * @return {Node} - продготовленная к вставке в DOM карточка объявления
 */
var renderNoticeCard = function (post) {
  var card = cardTemplate.cloneNode(true);
  var cardAvatar = card.querySelector('img');
  var cardParagraphs = card.querySelectorAll('p');
  var cardHeader = card.querySelector('h3');
  var cardAddress = card.querySelector('small');
  var cardPrice = card.querySelector('.popup__price');
  var cardOfferType = card.querySelector('h4');
  var cardOfferFeatures = card.querySelector('.popup__features');

  cardAvatar.src = post.author.avatar;
  cardHeader.innerText = post.offer.title;
  cardAddress.innerText = post.offer.address;
  cardPrice.innerHTML = post.offer.price + '&#x20bd;/ночь';
  cardOfferType.innerText = OFFER_TYPES_VOCABULARY[post.offer.type];
  cardParagraphs[2].innerText = getCardGuestsAndRoomsString(post);
  cardParagraphs[3].innerText = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;
  cardOfferFeatures.innerHTML = getFeaturesString(post);
  cardParagraphs[4].innerText = post.offer.description;

  return card;
};

/**
 * Формирование строки для вывода количества комнат и гостей
 * @param {Object} post - одно из случайно сгенерированных объявлений
 * @return {string}
 */
var getCardGuestsAndRoomsString = function (post) {
  var string = '';
  var roomsNumber = post.offer.rooms;
  var guestsNumber = post.offer.guests;

  string += roomsNumber;

  if (roomsNumber > 4) {
    string += ' комнат ';
  } else if (roomsNumber === 1) {
    string += ' комната ';
  } else {
    string += ' комнаты ';
  }

  string += ' для ' + guestsNumber;

  if (guestsNumber >= 2) {
    string += ' гостей';
  } else {
    string += ' гостя';
  }

  return string;
};

/**
 * Формирование строки с разметкой для блока с доступными удобствами
 * @param {Object} post - одно из случайно сгенерированных объявлений
 * @return {string}
 */
var getFeaturesString = function (post) {
  var features = post.offer.features;
  var string = '';

  features.forEach(function (feature) {
    string += '<li class="feature  feature--' + feature + '"></li>';
  });

  return string;
};

/**
 * Подготовка элементов по шаблону и вставка их в DOM
 * @param {Array|Object} data - исходные данные для подготовки DOM элемента
 * @param {Function} renderMethod - функция подготавливающая к вставке отдельные элементы по шаблону
 * @return {DocumentFragment} - готовый к вставке в DOM фрагмент
 */
var getDocumentFragment = function (data, renderMethod) {
  data = data.length ? data : [data];
  var fragment = document.createDocumentFragment();

  data.forEach(function (dataItem, index) {
    fragment.appendChild(renderMethod(dataItem, index));
  });

  return fragment;
};

// Получение карты
var map = document.querySelector('.map');

// Отключение затемнения карты
var removeMapFading = function () {
  map.classList.remove('map--faded');
};

// Получение формы объявления
var noticeForm = document.querySelector('.notice__form');
// Получение блоков fieldset в форме объявления
var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');

// Активация формы объявления
var activateNoticeForm = function () {
  noticeForm.classList.remove('notice__form--disabled');
  noticeFormFieldsets.forEach(function (fieldset) {
    fieldset.disabled = false;
  });
  // Очистка поля ввода заголовка формы, т. к. Edge игнорирует autocomplete='off'
  clearInputField(noticeFormTitleField);
  // Первичная синхронизация селектов количества комнат и гостей
  syncRoomsAndGuestsValue();
  // Первичная синхронизация типа жилья и минимальной цены
  syncHousingTypeAndMinPrice();
  addEventListener(submitFormButon, 'click', onSubmitFormButtonClick);
  addEventListener(noticeFormTitleField, 'input', onTitleFieldInput);
};

// Получение главного указателя карты
var mapPinMain = map.querySelector('.map__pin--main');
// Получение блока с указателями
var mapPinsBlock = map.querySelector('.map__pins');
// Получение контейнера блока фильтров
var mapFilters = map.querySelector('.map__filters-container');
// Генерирование массива случайных объявлений
var posts = generatePosts();

// Обработчик события mouseup на главном указателе карты
var onMapPinMainMouseUp = function () {
  // Отключение затемнения карты
  removeMapFading();
  // Активация полей формы
  activateNoticeForm();
  // Формирование фрагмента с указателями на карте
  var mapPinsFragment = getDocumentFragment(posts, renderMapPin);
  // Добавление фрагмента с указателями на страницу
  mapPinsBlock.appendChild(mapPinsFragment);
  addEventListener(mapPinsBlock, 'click', onMapPinClick);
  removeEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);
};

// Создание карточки объявления, добавление её в DOM
var addNoticeCard = function () {
  var activePin = mapPinsBlock.querySelector('.map__pin--active');

  if (activePin && !activePin.classList.contains('map__pin--main')) {
    var index = activePin.dataset.index;
    // Формирование фрагмента с карточкой объявления
    var card = getDocumentFragment(posts[index], renderNoticeCard);
    // Добавление фрагмента с карточкой на страницу
    map.insertBefore(card, mapFilters);
    enablePopupClose();
  }
};

// Удаление карточки объявления
var removeNoticeCard = function () {
  var card = map.querySelector('.popup');

  if (card) {
    disablePopupClose();
    map.removeChild(card);
  }
};

/**
 * Обработчик события click на указателе карты
 * @param {Object} event
 */
var onMapPinClick = function (event) {
  deactivateMapPin(event);
  removeNoticeCard();
  activateMapPin(event);
  addNoticeCard();
};

/**
 * Активация указателя на карте
 * @param {Object} event
 */
var activateMapPin = function (event) {
  var target = event.target;
  var currentPin = target.closest('.map__pin');

  if (currentPin) {
    currentPin.classList.add('map__pin--active');
  }
};

// Деактивация указателя на карте
var deactivateMapPin = function (event) {
  var target = event.target;
  // Проверка наличия активного указателя
  var activePin = mapPinsBlock.querySelector('.map__pin--active');
  // Условие декативации указателя: событие произошло на указателе или на кнопке закрытия карточки объявления
  var eventTargetCondition = (target.closest('.map__pin') || target.classList.contains('popup__close'));
  // Условие деактивации указателя: нажата клавиша ESC
  var eventKeycodeCondition = (event.keyCode === ESC_KEYCODE);

  if (activePin && eventTargetCondition || eventKeycodeCondition) {
    activePin.classList.remove('map__pin--active');
  }
};

/**
 * Обаботчик клика по кнопке закрытия окна карточки объявления
 * @param {Object} event
 */
var onPopupCloseClick = function (event) {
  removeNoticeCard();
  deactivateMapPin(event);
};

/**
 * Обработчик нажатия клавиши escape
 * @param {Object} event
 */
var onEscapeButtonKeydown = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    removeNoticeCard();
    deactivateMapPin(event);
  }
};

// Подключение процедуры закрытия окна карточки объявления
var enablePopupClose = function () {
  var popup = map.querySelector('.popup');
  var popupCloseButton = popup.querySelector('.popup__close');

  addEventListener(popupCloseButton, 'click', onPopupCloseClick);
  addEventListener(document, 'keydown', onEscapeButtonKeydown);
};

// Удаление обработчиков событий и отключение механизма закрытик окна карточки объявления
var disablePopupClose = function () {
  var popup = map.querySelector('.popup');
  var popupCloseButton = popup.querySelector('.popup__close');

  removeEventListener(popupCloseButton, 'click', onPopupCloseClick);
  removeEventListener(document, 'keydown', onEscapeButtonKeydown);
};

/**
 * Добавление обработчика события
 * @param {Element} element - элемент на который вешается обработчик
 * @param {string} eventType - обрабатываемое событие
 * @param {Function} handler - обработчик
 */
var addEventListener = function (element, eventType, handler) {
  element.addEventListener(eventType, handler);
};

/**
 * Удаление обработчика события
 * @param {Element} element - элемент с которого снимается обработчик
 * @param {string} eventType - обрабатываемое событие
 * @param {Function} handler - обработчик
 */
var removeEventListener = function (element, eventType, handler) {
  element.removeEventListener(eventType, handler);
};

// Получение поля ввода заголовка в форме объявления
var noticeFormTitleField = noticeForm.querySelector('#title');

/**
 * Очистка поля ввода
 * @param {Element} field
 */
var clearInputField = function (field) {
  field.value = '';
};

// Включение/отключение обводки для поля ввода в зависимости от статуса валидации
var toggleFieldOutline = function (field) {
  field.style.outline = field.checkValidity() ? 'none' : '2px solid red';
};

// Валидация поля ввода заголовка объявления
var validateTitleField = function () {
  var titleMinLength = noticeFormTitleField.getAttribute('minlength');

  if (noticeFormTitleField.value.length < titleMinLength || noticeFormTitleField.validity.tooShort) {
    noticeFormTitleField.setCustomValidity('Заголовок не может быть короче ' + titleMinLength + ' символов. Сейчас ' + noticeFormTitleField.value.length + '.');
  } else {
    noticeFormTitleField.setCustomValidity('');
  }
  toggleFieldOutline(noticeFormTitleField);
};

// Обработчик события 'input' на поле ввода заголовка
var onTitleFieldInput = function () {
  validateTitleField();
};

// Получение поля выбора времени заезда
var checkInTimeSelect = noticeForm.querySelector('#timein');
// Получение поля выбора времени выезда
var checkOutTimeSelect = noticeForm.querySelector('#timeout');

/**
 * Синхронизация значений полей формы
 * @param {Object} event
 * @param {Element} firstField
 * @param {Element} secondField
 */
var syncFieldsValue = function (event, firstField, secondField) {
  var target = event.target;

  if (target === firstField) {
    secondField.value = firstField.value;
  } else if (target === secondField) {
    firstField.value = secondField.value;
  }
};

// Получение селекта выбора количества комнат
var roomsValueSelect = noticeForm.querySelector('#room_number');
// Получение селекта выбора количества гостей
var capacitySelect = noticeForm.querySelector('#capacity');

// Синхронизация количества комнат с возможным количеством гостей
var syncRoomsAndGuestsValue = function () {
  var roomsValue = roomsValueSelect.value;
  // Изменение значения селекта количиства гостей в зависимости от выбранного кол-ва комнат
  capacitySelect.value = roomsValue !== '100' ? roomsValue : '0';

  // Если выбран пункт '100 комнат', деактивируются все опции, кроме 'не для гостей'
  if (roomsValue === '100') {
    Array.prototype.forEach.call(capacitySelect.options, function (option) {
      option.disabled = option.value !== '0';
    });
  } else {
    // Деактивация опций в селекте если комнат меньше чем гостей. Отключение пункта 'не для гостей'
    Array.prototype.forEach.call(capacitySelect.options, function (option) {
      option.disabled = (+roomsValue < +option.value || option.value === '0');
    });
  }
};

// Получение селекта выбора типа жилья
var housingTypeSelect = noticeForm.querySelector('#type');
// Получение поля ввода цены жилья
var housingPriceField = noticeForm.querySelector('#price');

// Синхронизация выбранного типа жилья и минимальной цены
var syncHousingTypeAndMinPrice = function () {
  switch (housingTypeSelect.value) {
    case 'bungalo':
      housingPriceField.min = 0;
      break;
    case 'flat':
      housingPriceField.min = 1000;
      break;
    case 'house':
      housingPriceField.min = 5000;
      break;
    case 'palace':
      housingPriceField.min = 10000;
  }
  toggleFieldOutline(housingPriceField);
};

// Получение кнопки отправки формы
var submitFormButon = noticeForm.querySelector('.form__submit');

/**
 * Обработка события 'click' на кнопке отправки формы
 * @param {Object} event
 */
var onSubmitFormButtonClick = function (event) {
  syncRoomsAndGuestsValue();
  syncHousingTypeAndMinPrice();
  syncFieldsValue(event, checkInTimeSelect, checkOutTimeSelect);
  validateTitleField();
};

addEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);
