'use strict';

var OFFER_TYPES_VOCABULARY = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var PIN_NEEDLE_HEIGHT = 18;
var ESC_KEYCODE = 27;

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

// Получение главного указателя карты
var mapPinMain = map.querySelector('.map__pin--main');
// Получение блока с указателями
var mapPinsBlock = map.querySelector('.map__pins');
// Получение контейнера блока фильтров
var mapFilters = map.querySelector('.map__filters-container');
// Генерирование массива случайных объявлений
var posts = window.data.getPosts();

// Обработчик события mouseup на главном указателе карты
var onMapPinMainMouseUp = function () {
  // Отключение затемнения карты
  removeMapFading();
  // Активация полей формы
  window.form.activateNoticeForm();
  // Формирование фрагмента с указателями на карте
  var mapPinsFragment = getDocumentFragment(posts, renderMapPin);
  // Добавление фрагмента с указателями на страницу
  mapPinsBlock.appendChild(mapPinsFragment);
  window.util.addEventListener(mapPinsBlock, 'click', onMapPinClick);
  window.util.removeEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);
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

  window.util.addEventListener(popupCloseButton, 'click', onPopupCloseClick);
  window.util.addEventListener(document, 'keydown', onEscapeButtonKeydown);
};

// Удаление обработчиков событий и отключение механизма закрытик окна карточки объявления
var disablePopupClose = function () {
  var popup = map.querySelector('.popup');
  var popupCloseButton = popup.querySelector('.popup__close');

  window.util.removeEventListener(popupCloseButton, 'click', onPopupCloseClick);
  window.util.removeEventListener(document, 'keydown', onEscapeButtonKeydown);
};

window.util.addEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);
