'use strict';

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
