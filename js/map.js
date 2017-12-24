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
    document.removeEventListener('mouseup', onMapPinMainMouseUp, false);
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
    document.addEventListener('mouseup', onMapPinMainMouseUp, false);
    document.removeEventListener('DOMContentLoaded', onDOMContentLoaded, false);
  };

  document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);

  window.map = {
    getAddressCoordinates: getAddressCoordinates
  };
})();
