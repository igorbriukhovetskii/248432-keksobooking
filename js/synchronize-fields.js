'use strict';

(function () {
  /**
   * Синхронизация значений двух полей
   * @param {Element} firstField
   * @param {Element} secondField
   * @param {Array} firstFieldValues
   * @param {Array} secondFieldValues
   * @param {Function} callback - функция определяет зависимость между полями
   */
  window.synchronizeFields = function (firstField, secondField, firstFieldValues, secondFieldValues, callback) {
    var index = firstFieldValues.indexOf(firstField.value);
    callback(secondField, secondFieldValues[index]);
  };
})();
