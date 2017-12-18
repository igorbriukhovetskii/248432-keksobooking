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
  // Добавление пинов на карту
  window.pin.addMapPins();
  window.util.addEventListener(mapPinsBlock, 'click', onMapPinClick);
  window.util.removeEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);
};

/**
 * Обработчик события click на указателе карты
 * @param {Object} event
 */
var onMapPinClick = function (event) {
  window.pin.deactivateMapPin(event);
  window.card.removeNoticeCard();
  window.pin.activateMapPin(event);
  window.card.addNoticeCard();
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
