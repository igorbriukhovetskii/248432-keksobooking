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
      // Минимальная координата указателя по горизонтали
      var minXcoordinate = 0;
      // Максимальная координата указателя по горизонтали
      var maxXcoordinate = parseInt(getComputedStyle(map).getPropertyValue('width'), 10);
      // Ограничения позиции указателя с учётом его размеров
      var pinPositionLimit = {
        top: minYcoordinate + pinFullHeight,
        bottom: maxYcoordinate + pinFullHeight,
        left: minXcoordinate + pinHeadWidth,
        right: maxXcoordinate - pinHeadWidth
      };

      // Проверка нахождения указателя в пределах ограничений по вертикали
      // с учётом вертикальных размеров указателя
      var topEdge = newPinCoordinates.y <= pinPositionLimit.top;
      var bottomEdge = newPinCoordinates.y >= pinPositionLimit.bottom;

      newPinCoordinates.y = topEdge ? pinPositionLimit.top : newPinCoordinates.y;
      newPinCoordinates.y = bottomEdge ? pinPositionLimit.bottom : newPinCoordinates.y;

      // Применение новых координат к указателю
      mapPinMain.style.top = newPinCoordinates.y + 'px';

      // Проверка нахождения указателя в пределах ограничений по горизонтали
      // с учётом горизонтальных размеров указателя
      var leftEdge = newPinCoordinates.x <= pinPositionLimit.left;
      var rightEdge = newPinCoordinates.x >= pinPositionLimit.right;

      newPinCoordinates.x = leftEdge ? pinPositionLimit.left : newPinCoordinates.x;
      newPinCoordinates.x = rightEdge ? pinPositionLimit.right : newPinCoordinates.x;

      // Применение новых координат к указателю
      mapPinMain.style.left = newPinCoordinates.x + 'px';
      window.form.setAddressCoordinates(newPinCoordinates);
    };

    // Обработчик события 'mouseup'
    var onMouseUp = function () {
      map.removeEventListener('mousemove', onMouseMove, false);
      document.removeEventListener('mouseup', onMouseUp, false);
    };

    map.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  };

  // Обработчик 'mouseup' на главном указателе карты
  var onMapPinMainMouseUp = function () {
    removeMapFading();
    window.form.activateNoticeForm();
    // Загрузка информации об объявлениях и добавление указателей на карту
    window.backend.download(window.pin.addMapPins, window.backend.onError);
    mapPinMain.removeEventListener('mouseup', onMapPinMainMouseUp, false);
  };

  /**
   * Обработчик загрузки страницы
   * @param {Object} event
   */
  var onDOMContentLoaded = function (event) {
    // Синхронизация количества комнат и гостей
    window.form.manageGuestNumber(event);
    // Получение координат главного указателя карты и заполнение поля с адресом
    window.form.setAddressCoordinates(getAddressCoordinates());

    mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown, false);
    mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp, false);
    document.removeEventListener('DOMContentLoaded', onDOMContentLoaded, false);
  };

  document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);

  window.map = {
    getAddressCoordinates: getAddressCoordinates
  };
})();
