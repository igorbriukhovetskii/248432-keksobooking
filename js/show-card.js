'use strict';

(function () {
  var OfferTypeEnum = {
    'FLAT': 'Квартира',
    'HOUSE': 'Дом',
    'BUNGALO': 'Бунгало'
  };

  /**
   * Формирование строки для вывода количества комнат и гостей
   * @param {Object} post - одно из случайно сгенерированных объявлений
   * @return {string}
   */
  var getCardGuestsAndRoomsString = function (post) {
    var string = '';
    var roomsNumber = post.offer.rooms;
    var guestsNumber = post.offer.guests;

    string += roomsNumber;

    if (roomsNumber > 4) {
      string += ' комнат ';
    } else if (roomsNumber === 1) {
      string += ' комната ';
    } else {
      string += ' комнаты ';
    }

    string += ' для ' + guestsNumber;

    if (guestsNumber >= 2) {
      string += ' гостей';
    } else {
      string += ' гостя';
    }

    return string;
  };

  /**
   * Формирование строки с разметкой для блока с доступными удобствами
   * @param {Object} post - одно из случайно сгенерированных объявлений
   * @return {string}
   */
  var getFeaturesString = function (post) {
    var features = post.offer.features;
    var string = '';

    features.forEach(function (feature) {
      string += '<li class="feature  feature--' + feature + '"></li>';
    });

    return string;
  };

  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');

  /**
   * Подготовка карточки объявления по шаблону
   * @param {Object} post - элемент сгенерированного массива случайных объявлений
   * @return {Node} - продготовленная к вставке в DOM карточка объявления
   */
  var renderNoticeCard = function (post) {
    var card = cardTemplate.cloneNode(true);
    var cardAvatar = card.querySelector('img');
    var cardParagraphs = card.querySelectorAll('p');
    var cardHeader = card.querySelector('h3');
    var cardAddress = card.querySelector('small');
    var cardPrice = card.querySelector('.popup__price');
    var cardOfferType = card.querySelector('h4');
    var cardOfferFeatures = card.querySelector('.popup__features');

    cardAvatar.src = post.author.avatar;
    cardHeader.innerText = post.offer.title;
    cardAddress.innerText = post.offer.address;
    cardPrice.innerHTML = post.offer.price + '&#x20bd;/ночь';
    cardOfferType.innerText = OfferTypeEnum[post.offer.type.toString().toUpperCase()];
    cardParagraphs[2].innerText = getCardGuestsAndRoomsString(post);
    cardParagraphs[3].innerText = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;
    cardOfferFeatures.innerHTML = getFeaturesString(post);
    cardParagraphs[4].innerText = post.offer.description;

    return card;
  };

  // Получение карты
  var map = document.querySelector('.map');
  // Получение блока с указателями (пинами) карты
  var mapPinsBlock = map.querySelector('.map__pins');
  // Получение контейнера блока фильтров
  var mapFilters = map.querySelector('.map__filters-container');

  // Показ карточки объявления
  window.showCard = function () {
    var activePin = mapPinsBlock.querySelector('.map__pin--active');

    if (activePin && !activePin.classList.contains('map__pin--main')) {
      var index = activePin.dataset.index;
      // Формирование фрагмента с карточкой объявления
      var card = window.util.getDocumentFragment(window.data.posts[index], renderNoticeCard);
      // Добавление фрагмента с карточкой на страницу
      map.insertBefore(card, mapFilters);
      window.card.enableCardClose();
    }
  };
})();
