'use strict';

(function () {
  var PIN_NEEDLE_HEIGHT = 18;
  var ESC_KEYCODE = 27;
  var PINS_MAX_NUMBER = 5;

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
    mapPin.dataset.type = post.offer.type;
    mapPin.dataset.features = post.offer.features;
    mapPin.dataset.price = post.offer.price;
    mapPin.dataset.guests = post.offer.guests;
    mapPin.dataset.rooms = post.offer.rooms;

    return mapPin;
  };

  // Получение карты
  var map = document.querySelector('.map');
  // Получение блока с указателями (пинами) карты
  var mapPinsBlock = map.querySelector('.map__pins');

  /**
   * Активация указателя на карте
   * @param {Object} event
   * @param {Array} offers - массив объявлений о сдаче жилья
   */
  var activateMapPin = function (event, offers) {
    var target = event.target;
    var currentPin = target.closest('.map__pin');

    if (currentPin) {
      currentPin.classList.add('map__pin--active');
      window.showCard(offers);
    }
  };

  // Деактивация указателя на карте
  var deactivateMapPin = function (event) {
    var target = event.target;
    // Проверка наличия активного указателя
    var activePin = mapPinsBlock.querySelector('.map__pin--active');
    if (activePin) {
      // Условие декативации указателя: событие произошло на указателе или на кнопке закрытия карточки объявления
      var eventTargetCondition = (target.closest('.map__pin') || target.classList.contains('popup__close'));
      // Условие деактивации указателя: нажата клавиша ESC
      var eventKeycodeCondition = (event.keyCode === ESC_KEYCODE);
      // Условие деактивации указателя: событие зарегистрировано на блоке фильтров карты
      var eventCurrentTargetCondition = (event.currentTarget !== document) && (event.currentTarget.classList.contains('map__filters-container'));

      if (eventTargetCondition || eventKeycodeCondition || eventCurrentTargetCondition) {
        activePin.classList.remove('map__pin--active');
        window.card.removeCard();
      }
    }
  };

  /**
   * Обработчик события click на указателе карты
   * @param {Object} event
   * @param {Array} offers - массив объявлений о сдаче жилья
   */
  var onMapPinClick = function (event, offers) {
    deactivateMapPin(event);
    activateMapPin(event, offers);
  };

  // Указатели карты на странице
  var mapPins;

  // Добавление указателей на карту
  var addMapPins = function (offers) {
    if (offers.length) {
      // Формирование фрагмента с указателями на карте
      var mapPinsFragment = window.util.getDocumentFragment(offers, renderMapPin);
      // Добавление фрагмента с указателями на страницу
      mapPinsBlock.appendChild(mapPinsFragment);
      // Получение добавленных на страницу пинов
      mapPins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');
      // Сокрытие лишних пинов
      limitShowedPins(mapPins);
      // Добавление обработчика клика на пине
      mapPinsBlock.addEventListener('click', function (event) {
        onMapPinClick(event, offers);
      }, false);
    } else {
      window.backend.onError('Не удалось загрузить похожие объявления');
    }
  };

  /**
   * Ограничение количества показываемых указателей
   * @param {Element[]|Array} pins - коллекция указателей карты
   */
  var limitShowedPins = function (pins) {
    window.util.hideElements(mapPins);
    var pinsToShow = Array.prototype.slice.call(pins, 0, PINS_MAX_NUMBER);
    window.util.showElements(pinsToShow);
  };

  // Получение блока фильтров карты
  var filtersBlock = map.querySelector('.map__filters-container');

  filtersBlock.addEventListener('change', function (event) {
    deactivateMapPin(event);
    window.util.debounce(function () {
      limitShowedPins(window.mapFilter.getFilteredPins(mapPins));
    });
  }, false);

  window.pin = {
    addMapPins: addMapPins,
    deactivateMapPin: deactivateMapPin
  };
})();
