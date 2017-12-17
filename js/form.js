'use strict';

(function () {
  // Получение формы объявления
  var noticeForm = document.querySelector('.notice__form');
  // Получение блоков fieldset в форме объявления
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  // Получение поля ввода заголовка в форме объявления
  var noticeFormTitleField = noticeForm.querySelector('#title');

  /**
   * Очистка поля ввода
   * @param {Element} field
   */
  var clearInputField = function (field) {
    field.value = '';
  };

  // Включение/отключение обводки для поля ввода в зависимости от статуса валидации
  var toggleFieldOutline = function (field) {
    field.style.outline = field.checkValidity() ? 'none' : '2px solid red';
  };

  // Валидация поля ввода заголовка объявления
  var validateTitleField = function () {
    var titleMinLength = noticeFormTitleField.getAttribute('minlength');

    if (noticeFormTitleField.value.length < titleMinLength || noticeFormTitleField.validity.tooShort) {
      noticeFormTitleField.setCustomValidity('Заголовок не может быть короче ' + titleMinLength + ' символов. Сейчас ' + noticeFormTitleField.value.length + '.');
    } else {
      noticeFormTitleField.setCustomValidity('');
    }
    toggleFieldOutline(noticeFormTitleField);
  };

  // Обработчик события 'input' на поле ввода заголовка
  var onTitleFieldInput = function () {
    validateTitleField();
  };

  // Получение поля выбора времени заезда
  var checkInTimeSelect = noticeForm.querySelector('#timein');
  // Получение поля выбора времени выезда
  var checkOutTimeSelect = noticeForm.querySelector('#timeout');

  /**
   * Синхронизация значений полей формы
   * @param {Object} event
   * @param {Element} firstField
   * @param {Element} secondField
   */
  var syncFieldsValue = function (event, firstField, secondField) {
    var target = event.target;

    if (target === firstField) {
      secondField.value = firstField.value;
    } else if (target === secondField) {
      firstField.value = secondField.value;
    }
  };

  // Получение селекта выбора количества комнат
  var roomsValueSelect = noticeForm.querySelector('#room_number');
  // Получение селекта выбора количества гостей
  var capacitySelect = noticeForm.querySelector('#capacity');

  // Синхронизация количества комнат с возможным количеством гостей
  var syncRoomsAndGuestsValue = function () {
    var roomsValue = roomsValueSelect.value;
    // Изменение значения селекта количиства гостей в зависимости от выбранного кол-ва комнат
    capacitySelect.value = roomsValue !== '100' ? roomsValue : '0';

    // Если выбран пункт '100 комнат', деактивируются все опции, кроме 'не для гостей'
    if (roomsValue === '100') {
      Array.prototype.forEach.call(capacitySelect.options, function (option) {
        option.disabled = option.value !== '0';
      });
    } else {
      // Деактивация опций в селекте если комнат меньше чем гостей. Отключение пункта 'не для гостей'
      Array.prototype.forEach.call(capacitySelect.options, function (option) {
        option.disabled = (+roomsValue < +option.value || option.value === '0');
      });
    }
  };

  // Получение селекта выбора типа жилья
  var housingTypeSelect = noticeForm.querySelector('#type');
  // Получение поля ввода цены жилья
  var housingPriceField = noticeForm.querySelector('#price');

  // Синхронизация выбранного типа жилья и минимальной цены
  var syncHousingTypeAndMinPrice = function () {
    switch (housingTypeSelect.value) {
      case 'bungalo':
        housingPriceField.min = 0;
        break;
      case 'flat':
        housingPriceField.min = 1000;
        break;
      case 'house':
        housingPriceField.min = 5000;
        break;
      case 'palace':
        housingPriceField.min = 10000;
    }
    toggleFieldOutline(housingPriceField);
  };

  // Получение поля для адреса
  var addressField = noticeForm.querySelector('#address');
  // Получение главного пина карты
  var mapPinMain = document.querySelector('.map__pin--main');

  // Установка координат адреса по положению главного пина
  var setAddressCoordinates = function () {
    // Получение объекта с вычисленными стилями главного пина
    var pin = getComputedStyle(mapPinMain);
    // Вычисление поправки по координате Х относительно центральной оси пина
    var pinXoffset = parseInt(pin.getPropertyValue('width'), 10) / 2;
    // Вычисление поправки по координате Y относительно острия иглы пина
    var pinYoffset = parseInt(pin.getPropertyValue('height'), 10);
    // Вычисление X координаты острия иглы пина
    var pinXcoordinate = parseInt(pin.getPropertyValue('left'), 10) - pinXoffset;
    // Вычисление Y координаты острия иглы пина
    var pinYcoordinate = parseInt(pin.getPropertyValue('top'), 10) - pinYoffset;
    // Изменение значения поля адреса
    addressField.value = pinXcoordinate + ', ' + pinYcoordinate;
  };

  /**
   * Обработка события 'change' формы
   * @param {Object} event
   */
  var onSubmitFormButtonClick = function (event) {
    syncRoomsAndGuestsValue();
    syncHousingTypeAndMinPrice();
    syncFieldsValue(event, checkInTimeSelect, checkOutTimeSelect);
    validateTitleField();
    setAddressCoordinates();
  };

  // Активация формы объявления
  var activateNoticeForm = function () {
    noticeForm.classList.remove('notice__form--disabled');
    noticeFormFieldsets.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    // Очистка поля ввода заголовка формы, т. к. Edge игнорирует autocomplete='off'
    clearInputField(noticeFormTitleField);
    // Первичная синхронизация селектов количества комнат и гостей
    syncRoomsAndGuestsValue();
    // Первичная синхронизация типа жилья и минимальной цены
    syncHousingTypeAndMinPrice();
    window.util.addEventListener(noticeForm, 'change', onSubmitFormButtonClick);
    window.util.addEventListener(noticeFormTitleField, 'input', onTitleFieldInput);
  };

  window.form = {
    activateNoticeForm: activateNoticeForm
  };
}());
