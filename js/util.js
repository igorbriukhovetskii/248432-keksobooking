'use strict';

(function () {
  var DEBOUNCE_TIMEOUT = 500;
  var lastDebounceTimeout;

  /**
   * Подготовка элементов по шаблону и вставка их в DOM
   * @param {Array|Object} data - исходные данные для подготовки DOM элемента
   * @param {Function} renderMethod - функция подготавливающая к вставке отдельные элементы по шаблону
   * @return {DocumentFragment} - готовый к вставке в DOM фрагмент
   */
  var getDocumentFragment = function (data, renderMethod) {
    data = data.length ? data : [data];
    var fragment = document.createDocumentFragment();

    data.forEach(function (dataItem, index) {
      fragment.appendChild(renderMethod(dataItem, index));
    });

    return fragment;
  };

  /**
   * Получение массива значений всех опций HTML-селекта
   * @param {Element} selectElement
   * @return {Array}
   */
  var getSelectElementOptions = function (selectElement) {
    var options = [];
    for (var i = 0; i < selectElement.options.length; i++) {
      options[i] = selectElement.options[i].value;
    }
    return options;
  };

  /**
   * Получение значений свойств объекта
   * @param {Object} object
   * @return {Array}
   */
  var getObjectValues = function (object) {
    var values = [];
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        values.push(object[key]);
      }
    }
    return values;
  };

  /**
   * Скрытие элементов на странице
   * @param {Element[]} elements
   */
  var hideElements = function (elements) {
    Array.prototype.forEach.call(elements, function (element) {
      element.classList.add('hidden');
    });
  };

  /**
   * Показ скрытых элементов на странице
   * @param {Element[]} elements
   */
  var showElements = function (elements) {
    Array.prototype.forEach.call(elements, function (element) {
      element.classList.remove('hidden');
    });
  };

  /**
   * Отложенное выполнение функции
   * @param {Function} callback
   */
  var debounce = function (callback) {
    if (lastDebounceTimeout) {
      clearTimeout(lastDebounceTimeout);
    }
    lastDebounceTimeout = setTimeout(callback, DEBOUNCE_TIMEOUT);
  };

  window.util = {
    getDocumentFragment: getDocumentFragment,
    getSelectElementOptions: getSelectElementOptions,
    getObjectValues: getObjectValues,
    hideElements: hideElements,
    showElements: showElements,
    debounce: debounce
  };
}());
