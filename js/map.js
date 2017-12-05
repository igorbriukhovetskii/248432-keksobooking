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
var PIN_Y_COORDINATE_MAX = 500;
var PIN_NEEDLE_HEIGHT = 18;

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

// Генерирование массива случайных объявлений
var generatePosts = function () {
  var posts = [];
  var avatarNumbers = getShuffledArray(AVATAR_NUMBERS);
  var offerTitles = getShuffledArray(OFFER_TITLES);

  // Функция конструктор объявления
  var Post = function () {
    var pinXcoordinate = getRandomInteger(PIN_X_COORDINATE_MAX, PIN_X_COORDINATE_MIN);
    var pinYcoordinate = getRandomInteger(PIN_Y_COORDINATE_MAX, PIN_Y_COORDINATE_MIN);

    this.author = {
      avatar: 'img/avatars/user' + extractLastArrayElement(avatarNumbers) + '.png'
    };
    this.offer = {
      title: extractLastArrayElement(offerTitles),
      address: '\'' + pinXcoordinate + ', ' + pinYcoordinate + '\'',
      price: getRandomInteger(OFFER_MAX_PRICE, OFFER_MIN_PRICE),
      type: getRandomArrayElement(OFFER_TYPES),
      rooms: getRandomInteger(OFFER_MAX_ROOM_NUMBER, OFFER_MIN_ROOM_NUMBER),
      guests: getRandomInteger(GUESTS_MAX_NUMBER),
      checkin: getRandomArrayElement(CHECKIN_TIMES),
      checkout: getRandomArrayElement(CHECKOUT_TIMES),
      features: getRandomLengthArray(getShuffledArray(OFFER_FEATURES)),
      description: '',
      photos: []
    };
    this.location = {
      x: pinXcoordinate,
      y: pinYcoordinate
    };
  };

  for (var i = 0; i < AVATAR_NUMBERS.length; i++) {
    posts.push(new Post());
  }

  return posts;
};

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');

/**
 * Подготовка нового указателя на карте по шаблону
 * @param {Object} post - элемент сгенерированного массива случайных объявлений
 * @return {Node} - подготовленный к вставке указатель (пин) на карте
 */
var renderMapPin = function (post) {
  var mapPin = pinTemplate.cloneNode(true);
  var mapPinImage = mapPin.querySelector('img');
  var pinOffsetX = mapPinImage.getAttribute('width') / 2;
  var pinOffsetY = parseInt(mapPinImage.getAttribute('height'), 10) + PIN_NEEDLE_HEIGHT;

  mapPin.style.left = post.location.x - pinOffsetX + 'px';
  mapPin.style.top = post.location.y - pinOffsetY + 'px';
  mapPinImage.src = post.author.avatar;

  return mapPin;
};


/**
 * Подготовка элементов по шаблону и вставка их в DOM
 * @param {Array} postsArray - сгенерированный массив объявлений
 * @param {Function} renderMethod - функция подготавливающая к вставке отдельные элементы по шаблону
 * @return {DocumentFragment} - готовый к вставке в DOM фрагмент
 */
var getDocumentFragment = function (postsArray, renderMethod) {
  var fragment = document.createDocumentFragment();

  postsArray.forEach(function (post) {
    fragment.appendChild(renderMethod(post));
  });

  return fragment;
};

var map = document.querySelector('.map');
var mapPinsBlock = map.querySelector('.map__pins');
map.classList.remove('map--faded');
var posts = generatePosts();
var mapPinsFragment = getDocumentFragment(posts, renderMapPin);
mapPinsBlock.appendChild(mapPinsFragment);
