'use strict';

(function () {
  var MINIMAL_PRICE = 10000;
  var MAXIMAL_PRICE = 50000;

  // Блок с фильтрами карты
  var filtersBlock = document.querySelector('.map__filters-container');
  // Селект выбора типа жилья
  var housingFilter = filtersBlock.querySelector('#housing-type');
  // Селект выбора цены
  var priceFilter = filtersBlock.querySelector('#housing-price');
  // Селект выбора количества комнат
  var roomsFilter = filtersBlock.querySelector('#housing-rooms');
  // Селект выбора количества гостей
  var capacityFilter = filtersBlock.querySelector('#housing-guests');
  // Блок чекбоксов с типами удобств
  var featuresFilters = filtersBlock.querySelectorAll('[name="features"]');

  /**
   * Проверка указателя карты на соответствие имени data-атрибута значению селекта фильтра
   * @param {string} dataName - имя data-атрибута
   * @param {string} filterValue - значение фильтра
   * @return {Function}
   */
  var filterByValue = function (dataName, filterValue) {
    /**
     * @param {Element} pin - указатель карты
     * @return {boolean}
     */
    return function (pin) {
      return pin.dataset[dataName] === filterValue.value ? true : filterValue.value === 'any';
    };
  };

  /**
   * Проверка соответствия значения data-price указателя карты выбранному в фильтре значению цены
   * @param {string} filterValue - значение фильтра
   * @return {Function}
   */
  var filterByPrice = function (filterValue) {
    /**
     * @param {Element} pin - указатель карты
     * @return {boolean}
     */
    return function (pin) {
      switch (filterValue.value) {
        case 'low':
          return pin.dataset.price < MINIMAL_PRICE;
        case 'middle':
          return pin.dataset.price >= MINIMAL_PRICE && pin.dataset.price <= MAXIMAL_PRICE;
        case 'high':
          return pin.dataset.price > MAXIMAL_PRICE;
        default:
          return true;
      }
    };
  };

  /**
   * Проверка наличия в data-features указателя карты выбранных в фильтре удобств
   * @param {Element[]|Array} featuresCheckboxes - коллекция чебоксов в блоке фильтра по удобствам
   * @return {Function}
   */
  var filterByFeatures = function (featuresCheckboxes) {
    /**
     * @param {Element} pin - указатель карты
     * @return {boolean}
     */
    return function (pin) {
      // Получение массива с отмеченными чекбоксами
      var checkedFeatures = Array.prototype.filter.call(featuresCheckboxes, function (feature) {
        return feature.checked;
      });

      // Формирование строки для поиска наличия удобств
      var regExp = '';
      checkedFeatures.forEach(function (feature) {
        regExp += '(?:' + feature.value + ').*';
      });

      // Поиск наличия удобств
      if (checkedFeatures.length) {
        return pin.dataset.features.match(regExp);
      } else {
        return true;
      }
    };
  };

  // Фильтр по типу жилья
  var filterType = filterByValue('type', housingFilter);
  // Фильтр по количеству комнат
  var filterRooms = filterByValue('rooms', roomsFilter);
  // Фильтр по количеству гостей
  var filterGuests = filterByValue('guests', capacityFilter);
  // Фильтр по цене
  var filterPrice = filterByPrice(priceFilter);
  // Фильтр по удобствам
  var filterFeature = filterByFeatures(featuresFilters);

  var filters = [filterType, filterRooms, filterGuests, filterPrice, filterFeature];

  /**
   * Фильтрация коллекции указателей карты по выбранным значениям фильтров
   * @param {Element[]} pins
   * @return {Array}
   */
  var getFilteredPins = function (pins) {
    return Array.prototype.filter.call(pins, function (pin) {
      return filters.every(function (filter) {
        return filter(pin);
      });
    });
  };

  window.mapFilter = {
    getFilteredPins: getFilteredPins
  };
})();
