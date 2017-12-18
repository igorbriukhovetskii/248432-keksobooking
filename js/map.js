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

  // Обработчик события mouseup на главном указателе карты
  var onMapPinMainMouseUp = function () {
    // Отключение затемнения карты
    removeMapFading();
    // Активация полей формы
    window.form.activateNoticeForm();
    // Добавление пинов на карту
    window.pin.addMapPins();
    window.util.removeEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);
  };

  window.util.addEventListener(mapPinMain, 'mouseup', onMapPinMainMouseUp);

})();
