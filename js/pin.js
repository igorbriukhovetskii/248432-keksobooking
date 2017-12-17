'use strict';

(function () {
  var PIN_NEEDLE_HEIGHT = 18;

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

  window.pin = {
    renderMapPin: renderMapPin
  };
})();
