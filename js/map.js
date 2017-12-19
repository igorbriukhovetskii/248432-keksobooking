'use strict';

(function () {
  // Получение карты
  var map = document.querySelector('.map');

  // Отключение затемнения карты
  var removeMapFading = function () {
    map.classList.remove('map--faded');
  };

  // Получение главного указателя карты
  var mapPinMain = map.querySelector('.map__pin--main');
  // Ширина головки указателя карты
  var pinHeadWidth = parseInt(getComputedStyle(mapPinMain).getPropertyValue('width'), 10);
  // Высота головки указателя карты
  var pinHeadHeight = parseInt(getComputedStyle(mapPinMain).getPropertyValue('height'), 10);
  // Высота острия указателя карты
  var pinNeedleHeight = parseInt(getComputedStyle(mapPinMain, ':after').getPropertyValue('border-top-width'), 10);
  // Вычисление полной высоты указателя карты
  var pinFullHeight = pinHeadHeight + pinNeedleHeight;

  // Получение координат точки на карте, на которую указывает главный указатель
  var getAddressCoordinates = function () {
    return {
      x: parseInt(getComputedStyle(mapPinMain).getPropertyValue('left'), 10) + (pinHeadWidth / 2),
      y: parseInt(getComputedStyle(mapPinMain).getPropertyValue('top'), 10) + pinFullHeight
    };
  };

  // Активация карты
  var activateMap = function () {
    // Отключение затемнения карты
    removeMapFading();
    // Активация полей формы
    window.form.activateNoticeForm();
    // Добавление пинов на карту
    window.pin.addMapPins();
  };

  /**
   * Обработчик события 'mousedown' на главном указателе карты
   * @param {Object} event
   */
  var onMapPinMainMouseDown = function (event) {
    // Получение начальных координат указателя мыши
    var start = {
      x: event.clientX,
      y: event.clientY
    };

    /**
     * Обработчик события 'mousemove'
     * @param {Object} moveEvent
     */
    var onMouseMove = function (moveEvent) {
      // Вычисление изменения координат указателя мыши
      var shift = {
        x: moveEvent.clientX - start.x,
        y: moveEvent.clientY - start.y
      };

      start = {
        x: moveEvent.clientX,
        y: moveEvent.clientY
      };

      // Вычисление новых координат верхнего-левого угла главного указателя карты
      var newPinCoordinates = {
        x: mapPinMain.offsetLeft + shift.x,
        y: mapPinMain.offsetTop + shift.y
      };

      // Минимальная координата указателя по вертикали
      var minYcoordinate = 100;
      // Максимальная координата указателя по вертикали
      var maxYcoordinate = 500;

      // Проверка нахождения указателя в пределах ограничений по вертикали
      // с учётом вертикальных размеров указателя
      if (newPinCoordinates.y <= minYcoordinate + pinFullHeight) {
        newPinCoordinates.y = minYcoordinate + pinFullHeight;
      } else if (newPinCoordinates.y >= maxYcoordinate + pinFullHeight) {
        newPinCoordinates.y = maxYcoordinate + pinFullHeight;
      }
      // Применение новых координат к указателю
      mapPinMain.style.top = newPinCoordinates.y + 'px';

      // Минимальная координата указателя по горизонтали
      var minXcoordinate = 0;
      // Минимальная координата указателя по вертикали
      var maxXcoordinate = parseInt(getComputedStyle(map).getPropertyValue('width'), 10);

      // Проверка нахождения указателя в пределах ограничений по горизонтали
      // с учётом горизонтальных размеров указателя
      if (newPinCoordinates.x <= minXcoordinate + pinHeadWidth) {
        newPinCoordinates.x = minXcoordinate + pinHeadWidth;
      } else if (newPinCoordinates.x >= maxXcoordinate - pinHeadWidth) {
        newPinCoordinates.x = maxXcoordinate - pinHeadWidth;
      }
      // Применение новых координат к указателю
      mapPinMain.style.left = newPinCoordinates.x + 'px';
      window.form.setAddressCoordinates(newPinCoordinates);
    };

    // Обработчик события 'mouseup'
    var onMouseUp = function () {
      activateMap();
      window.util.removeEventListener(map, 'mousemove', onMouseMove);
      window.util.removeEventListener(document, 'mouseup', onMouseUp);
      window.util.addEventListener(mapPinMain, 'mousedown', onMapPinMainMouseDown);
    };

    window.util.addEventListener(map, 'mousemove', onMouseMove);
    window.util.addEventListener(document, 'mouseup', onMouseUp);
  };

  window.util.addEventListener(mapPinMain, 'mousedown', onMapPinMainMouseDown);
  window.form.setAddressCoordinates(getAddressCoordinates());
})();
