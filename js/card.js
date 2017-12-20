'use strict';

(function () {
  var ESC_KEYCODE = 27;

  // Получение карты
  var map = document.querySelector('.map');

  // Удаление карточки объявления
  var removeCard = function () {
    var card = map.querySelector('.popup');

    if (card) {
      disableCardClose();
      map.removeChild(card);
    }
  };

  /**
   * Обаботчик клика по кнопке закрытия окна карточки объявления
   * @param {Object} event
   */
  var onPopupCloseClick = function (event) {
    removeCard();
    window.pin.deactivateMapPin(event);
  };

  /**
   * Обработчик нажатия клавиши escape
   * @param {Object} event
   */
  var onEscapeButtonKeydown = function (event) {
    if (event.keyCode === ESC_KEYCODE) {
      removeCard();
      window.pin.deactivateMapPin(event);
    }
  };

  // Подключение процедуры закрытия окна карточки объявления
  var enableCardClose = function () {
    var popup = map.querySelector('.popup');
    var popupCloseButton = popup.querySelector('.popup__close');

    popupCloseButton.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onEscapeButtonKeydown);
  };

  // Удаление обработчиков событий и отключение механизма закрытия окна карточки объявления
  var disableCardClose = function () {
    var popup = map.querySelector('.popup');
    var popupCloseButton = popup.querySelector('.popup__close');

    popupCloseButton.removeEventListener('click', onPopupCloseClick);
    document.removeEventListener('keydown', onEscapeButtonKeydown);
  };

  window.card = {
    removeCard: removeCard,
    enableCardClose: enableCardClose,
    disableCardClose: disableCardClose
  };
}());
