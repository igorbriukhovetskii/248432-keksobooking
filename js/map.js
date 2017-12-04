'use strict';

var AVATAR_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var OFFER_MIN_PRICE = 1000;
var OFFER_MAX_PRICE = 1e6;
var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var OFFER_TYPES_VOCABULARY = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var OFFER_MIN_ROOM_NUMBER = 1;
var OFFER_MAX_ROOM_NUMBER = 5;
var GUESTS_MAX_NUMBER = 10;
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PIN_X_COORDINATE_MIN = 300;
var PIN_X_COORDINATE_MAX = 900;
var PIN_Y_COORDINATE_MIN = 100;
var PIN_Y_COORDINATE_MIN = 500;

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

var getShuffledArray = function (array) {
  var shuffledArray = array.slice(0);
  for (var i = shuffledArray.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * i + 1);
    var swap = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = swap;
  }
  return shuffledArray;
};
