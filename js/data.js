'use strict';

(function () {
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
  var OFFER_MIN_ROOM_NUMBER = 1;
  var OFFER_MAX_ROOM_NUMBER = 5;
  var GUESTS_MAX_NUMBER = 10;
  var GUESTS_MIN_NUMBER = 1;
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PIN_X_COORDINATE_MIN = 300;
  var PIN_X_COORDINATE_MAX = 900;
  var PIN_Y_COORDINATE_MIN = 100;
  var PIN_Y_COORDINATE_MAX = 500;

  var posts = [];

  // Генерирование массива случайных объявлений
  var getPosts = function () {
    var avatarNumbers = window.util.getShuffledArray(AVATAR_NUMBERS);
    var offerTitles = window.util.getShuffledArray(OFFER_TITLES);

    // Генерация объявления
    var generatePost = function () {
      var pinXcoordinate = window.util.getRandomInteger(PIN_X_COORDINATE_MAX, PIN_X_COORDINATE_MIN);
      var pinYcoordinate = window.util.getRandomInteger(PIN_Y_COORDINATE_MAX, PIN_Y_COORDINATE_MIN);

      return {
        author: {
          avatar: 'img/avatars/user' + window.util.extractLastArrayElement(avatarNumbers) + '.png'
        },
        offer: {
          title: window.util.extractLastArrayElement(offerTitles),
          address: '\'' + pinXcoordinate + ', ' + pinYcoordinate + '\'',
          price: window.util.getRandomInteger(OFFER_MAX_PRICE, OFFER_MIN_PRICE),
          type: window.util.getRandomArrayElement(OFFER_TYPES),
          rooms: window.util.getRandomInteger(OFFER_MAX_ROOM_NUMBER, OFFER_MIN_ROOM_NUMBER),
          guests: window.util.getRandomInteger(GUESTS_MAX_NUMBER, GUESTS_MIN_NUMBER),
          checkin: window.util.getRandomArrayElement(CHECKIN_TIMES),
          checkout: window.util.getRandomArrayElement(CHECKOUT_TIMES),
          features: window.util.getRandomLengthArray(window.util.getShuffledArray(OFFER_FEATURES)),
          description: '',
          photos: []
        },
        location: {
          x: pinXcoordinate,
          y: pinYcoordinate
        }
      };
    };

    for (var i = 0; i < AVATAR_NUMBERS.length; i++) {
      posts.push(generatePost());
    }
  };

  getPosts();

  window.data = {
    posts: []
  };
}());
