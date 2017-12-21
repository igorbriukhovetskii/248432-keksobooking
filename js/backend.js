'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';

  window.showNetworkError = function (error) {
    var errorBlock = document.createElement('div');

    errorBlock.innerText = error;
    errorBlock.classList.add('error-message');

    document.body.insertAdjacentElement('afterbegin', errorBlock);
  };

  var downloadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          onError('Не верный запрос');
          break;
        case 401:
          onError('Пользователь не авторизован');
          break;
        case 404:
          onError('Данные не найдены');
          break;
        default:
          onError('Ошибка доступа: ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время ожидания для запроса');
    });

    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = {
    download: downloadData
  };
})();
