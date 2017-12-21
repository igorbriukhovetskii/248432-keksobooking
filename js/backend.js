'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking/';

  // Настройки запроса
  var getSetup = function () {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    return xhr;
  };

  /**
   * Получение строки с ошибкой сети
   * @param {string} status
   * @return {string}
   */
  var getErrorMessage = function (status) {
    var errorMessage;
    switch (status) {
      case 400:
        errorMessage = 'Не верный запрос';
        break;
      case 401:
        errorMessage = 'Пользователь не авторизован';
        break;
      case 404:
        errorMessage = 'Данные не найдены';
        break;
      default:
        errorMessage = 'Ошибка доступа: ' + status;
    }

    return errorMessage;
  };

  /**
   * Установка обработчиков событий сети
   * @param {Object} xhr
   * @param {Function} onLoad - обаботчик загрузки
   * @param {Function} onError - обработчик ошибок
   */
  var setNetworkEventHandlers = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(getErrorMessage(xhr.status));
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания для запроса');
    });
  };

  /**
   * Показ ошибки на странице
   * @param {string} error
   */
  var showNetworkError = function (error) {
    var errorBlock = document.createElement('div');

    errorBlock.innerText = error;
    errorBlock.classList.add('error-message');

    document.body.insertAdjacentElement('afterbegin', errorBlock);
  };

  /**
   * Загрузка данных с сервера
   * @param {Function} onLoad - обработчик загрузки
   * @param {Function} onError - обработчик ошибок
   */
  var downloadData = function (onLoad, onError) {
    var xhr = getSetup();
    setNetworkEventHandlers(xhr, onLoad, onError);
    xhr.open('GET', GET_URL);
    xhr.send();
  };

  /**
   * Передача данных на сервер
   * @param {Object} data - информация формы
   * @param {Function} onLoad - обработчик загрузки
   * @param {Function} onError - обработчик ошибок
   */
  var uploadData = function (data, onLoad, onError) {
    var xhr = getSetup();
    setNetworkEventHandlers(xhr, onLoad, onError);
    xhr.open('POST', POST_URL);
    xhr.send(data);
  };

  window.backend = {
    download: downloadData,
    upload: uploadData,
    onError: showNetworkError
  };
})();
