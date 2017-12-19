'use strict';

(function () {
  /**
   * Получение случайного целого числа в заданном диапазоне
   * @param {number} maxValue - максимальное возможное число
   * @param {number} minValue - минимальное возможное число, по умолчанию равно 0
   * @return {number} - случайное целое число
   */
  var getRandomInteger = function (maxValue, minValue) {
    minValue = minValue || 0;
    return Math.floor(Math.random() * (maxValue + 1 - minValue) + minValue);
  };

  /**
   * Получение случайного элемента массива
   * @param {Array} array
   * @return {*} - случайный элемент массива
   */
  var getRandomArrayElement = function (array) {
    return array[getRandomInteger(array.length - 1, 0)];
  };

  /**
   * Перетасовка массива
   * @param {Array} array
   * @return {Array} shuffledArray - возвращает перетасованную копию оригинального массива
   */
  var getShuffledArray = function (array) {
    var shuffledArray = array.slice();
    for (var i = shuffledArray.length - 1; i >= 0; i--) {
      var j = Math.floor(Math.random() * i + 1);
      var swap = shuffledArray[i];
      shuffledArray[i] = shuffledArray[j];
      shuffledArray[j] = swap;
    }
    return shuffledArray;
  };

  /**
   * Извлекает последний элемент массива, уменьшает исходный массив
   * @param {Array} array
   * @return {*}
   */
  var extractLastArrayElement = function (array) {
    return array.splice(array.length - 1, 1);
  };

  /**
   * Укорачивает исходный массив на произвольное количество элементов
   * @param {Array} array
   * @return {Array} - укороченный массив
   */
  var getRandomLengthArray = function (array) {
    return array.slice(getRandomInteger(array.length - 1, 1));
  };

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

  window.util = {
    getRandomInteger: getRandomInteger,
    getRandomArrayElement: getRandomArrayElement,
    getShuffledArray: getShuffledArray,
    extractLastArrayElement: extractLastArrayElement,
    getRandomLengthArray: getRandomLengthArray,
    getDocumentFragment: getDocumentFragment
  };
}());
