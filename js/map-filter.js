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
  // Блок чекбоксов типами удобств
  var featuresFilters = filtersBlock.querySelectorAll('[name="features"]');

  /**
   * Фильтрация указателей карты
   * @param {Element[]|Array} pins - коллекция указателей карты
   * @param {string} dataName - имя data-атрибута
   * @param {string} filterValue - значение фильтра
   * @return {Array}
   */
  var filterByValue = function (pins, dataName, filterValue) {
    return Array.prototype.filter.call(pins, function (pin) {
      return pin.dataset[dataName] === filterValue ? true : filterValue === 'any';
    });
  };

  /**
   * Фильтрация указателей карты по цене объявления
   * @param {Element[]|Array} pins - коллекция указателей карты
   * @param {string} dataName - имя data-атрибута
   * @param {string} filterValue - значение фильтра
   * @return {Array}
   */
  var filterByPrice = function (pins, dataName, filterValue) {
    return Array.prototype.filter.call(pins, function (pin) {
      switch (filterValue) {
        case 'low':
          return pin.dataset.price < MINIMAL_PRICE;
        case 'middle':
          return pin.dataset.price >= MINIMAL_PRICE && pin.dataset.price <= MAXIMAL_PRICE;
        case 'high':
          return pin.dataset.price > MAXIMAL_PRICE;
        default:
          return true;
      }
    });
  };

  /**
   * Фильтрация указателей карты по удобствам
   * @param {Element[]|Array} pins - коллекция указателей карты
   * @param {Element[]|Array} featuresCheckboxes - коллекция чебоксов в блоке фильтра по удобствам
   * @return {Array}
   */
  var filterByFeatures = function (pins, featuresCheckboxes) {
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
      return Array.prototype.filter.call(pins, function (pin) {
        return pin.dataset.features.match(regExp);
      });
    } else {
      return pins;
    }
  };

  /**
   * Получение отфильтрованного массива указателей карты
   * @param {Element[]|Array} pins - коллекция указателей карты
   * @return {Array}
   */
  var getFilteredPins = function (pins) {
    var filteredPins = filterByValue(pins, 'type', housingFilter.value);
    if (filteredPins.length) {
      filteredPins = filterByValue(filteredPins, 'rooms', roomsFilter.value);
    }
    if (filteredPins.length) {
      filteredPins = filterByValue(filteredPins, 'guests', capacityFilter.value);
    }
    if (filteredPins.length) {
      filteredPins = filterByPrice(filteredPins, 'price', priceFilter.value);
    }
    if (filteredPins.length) {
      filteredPins = filterByFeatures(filteredPins, featuresFilters);
    }

    return filteredPins;
  };

  window.mapFilter = {
    getFilteredPins: getFilteredPins
  };
})();
