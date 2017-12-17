'use strict';

var ESC_KEYCODE = 27;

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
var posts = window.data.posts;

// Обработчик события mouseup на главном указателе карты
var onMapPinMainMouseUp = function () {
  // Отключение затемнения карты
  removeMapFading();
  // Активация полей формы
  window.form.activateNoticeForm();
  // Формирование фрагмента с указателями на карте
  var mapPinsFragment = window.util.getDocumentFragment(posts, window.pin.renderMapPin);
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
    var card = window.util.getDocumentFragment(posts[index], window.card.renderNoticeCard);
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

// Удаление обработчиков событий и отключение механизма закрытия окна карточки объявления
var disablePopupClose = function () {
  var popup = map.querySelector('.popup');
  var popupCloseButton = popup.querySelector('.popup__close');

  window.util.removeEventListener(popupCloseButton, 'click', onPopupCloseClick);
  window.util.removeEventListener(document, 'keydown', onEscapeButtonKeydown);
};

window.util.addEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);
