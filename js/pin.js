'use strict';

(function () {
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

  // Получение карты
  var map = document.querySelector('.map');
  // Получение блока с указателями (пинами) карты
  var mapPinsBlock = map.querySelector('.map__pins');

  var addMapPins = function () {
    // Формирование фрагмента с указателями на карте
    var mapPinsFragment = window.util.getDocumentFragment(window.data.posts, renderMapPin);
    // Добавление фрагмента с указателями на страницу
    mapPinsBlock.appendChild(mapPinsFragment);
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

  window.pin = {
    addMapPins: addMapPins,
    activateMapPin: activateMapPin,
    deactivateMapPin: deactivateMapPin
  };
})();
