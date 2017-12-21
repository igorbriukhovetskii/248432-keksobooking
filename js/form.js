'use strict';

(function () {
  // Минимальные цены на разные типы жилья
  var MinimalPriceEnum = {
    'FLAT': 1000,
    'BUNGALO': 0,
    'HOUSE': 5000,
    'PALACE': 10000
  };
  // Соответствие количества комнат в предложении максимальному количеству гостей
  var MaxRoomsCapacityEnum = {
    '1': '1',
    '2': '2',
    '3': '3',
    '100': '0'
  };
  // Получение формы объявления
  var noticeForm = document.querySelector('.notice__form');
  // Получение блоков fieldset в форме объявления
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  // Получение поля ввода заголовка в форме объявления
  var noticeFormTitleField = noticeForm.querySelector('#title');

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
  // Получение селекта выбора типа жилья
  var housingTypeSelect = noticeForm.querySelector('#type');
  // Получение поля ввода цены жилья
  var housingPriceField = noticeForm.querySelector('#price');
  // Получение селекта выбора количества комнат
  var roomsValueSelect = noticeForm.querySelector('#room_number');
  // Получение селекта выбора количества гостей
  var capacitySelect = noticeForm.querySelector('#capacity');
  // Получение массива времён заезда
  var checkinTimes = window.util.getSelectElementOptions(checkInTimeSelect);
  // Получение массива времён выезда
  var checkoutTimes = window.util.getSelectElementOptions(checkOutTimeSelect);
  // Получение массива типов жилья
  var housingTypes = window.util.getSelectElementOptions(housingTypeSelect);
  // Получение массива возможного количества комнат в предложении
  var roomsValue = window.util.getSelectElementOptions(roomsValueSelect);

  /**
   * Установка значения в поле ввода
   * @param {Element} element
   * @param {string|number} value
   */
  var setValue = function (element, value) {
    element.value = value;
  };

  /**
   * Установка значения аттрибута 'min' числового поля ввода
   * @param {Element} element
   * @param {string|number} value
   */
  var setMinAttribute = function (element, value) {
    element.min = value;
  };

  // Синхронизация количества комнат с возможным количеством гостей
  var disableGuestsOptions = function () {
    var roomsNumber = roomsValueSelect.value;
    // Изменение значения селекта количиства гостей в зависимости от выбранного кол-ва комнат
    // capacitySelect.value = roomsValue !== '100' ? roomsValue : '0';

    // Если выбран пункт '100 комнат', деактивируются все опции, кроме 'не для гостей'
    if (roomsNumber === '100') {
      Array.prototype.forEach.call(capacitySelect.options, function (option) {
        option.disabled = option.value !== '0';
      });
    } else {
      // Деактивация опций в селекте если комнат меньше чем гостей. Отключение пункта 'не для гостей'
      Array.prototype.forEach.call(capacitySelect.options, function (option) {
        option.disabled = (+roomsNumber < +option.value || option.value === '0');
      });
    }
  };

  // Получение максимального количества гостей для разного количества комнат
  var maxGuests = window.util.getObjectValues(MaxRoomsCapacityEnum);

  // Управление селектами выбора количества комнат и гостей
  var manageGuestNumber = function (event) {
    // Отключение недоступных вариантов в селекте выбора количества гостей
    disableGuestsOptions();
    // Синхронизация количества комнат с количеством гостей
    if (event.target === roomsValueSelect) {
      window.synchronizeFields(roomsValueSelect, capacitySelect, roomsValue, maxGuests, setValue);
    }
  };

  // Получение минимальных цен из объекта прайслист
  var minimalPrices = window.util.getObjectValues(MinimalPriceEnum);

  // Управление миниальной ценой предложения
  var manageMinimalPrice = function () {
    // Синхронизация типа жилья и минимальной цены
    window.synchronizeFields(housingTypeSelect, housingPriceField, housingTypes, minimalPrices, setMinAttribute);
    // Включение/выключение рамки для индикации статуса валидации поля
    toggleFieldOutline(housingPriceField);
  };

  /**
   * Синхронизация времён заезда/выезда
   * @param {Object} event
   */
  var synchronizeTimes = function (event) {
    if (event.target === checkInTimeSelect) {
      window.synchronizeFields(checkInTimeSelect, checkOutTimeSelect, checkinTimes, checkoutTimes, setValue);
    } else if (event.target === checkOutTimeSelect) {
      window.synchronizeFields(checkOutTimeSelect, checkInTimeSelect, checkoutTimes, checkinTimes, setValue);
    }
  };

  // Получение поля для адреса
  var addressField = noticeForm.querySelector('#address');

  // Заполнение поля для адреса значениями координат
  var setAddressCoordinates = function (coordinates) {
    // Изменение значения поля адреса
    addressField.value = 'x: ' + coordinates.x + ' ,y: ' + coordinates.y;
  };

  /**
   * Обработка события 'change' формы
   * @param {Object} event
   */
  var onNoticeFormChange = function (event) {
    manageGuestNumber(event);
    manageMinimalPrice();
    synchronizeTimes(event);
    validateTitleField();
  };

  // Сброс формы объявления в исходное состояние
  var resetForm = function () {
    noticeForm.reset();
    disableGuestsOptions();
    window.synchronizeFields(roomsValueSelect, capacitySelect, roomsValue, maxGuests, setValue);
    window.form.setAddressCoordinates(window.map.getAddressCoordinates());
  };

  // Обработчик события отправки формы
  var onNoticeFormSubmit = function () {
    var data = new FormData(noticeForm);
    window.backend.upload(data, resetForm, window.backend.onError);
    event.preventDefault();
  };

  // Активация формы объявления
  var activateNoticeForm = function () {
    noticeForm.classList.remove('notice__form--disabled');
    noticeFormFieldsets.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    // Очистка поля ввода заголовка формы, т. к. Edge игнорирует autocomplete='off'
    setValue(noticeFormTitleField, '');
    noticeForm.addEventListener('change', onNoticeFormChange, false);
    noticeFormTitleField.addEventListener('input', onTitleFieldInput, false);
    noticeForm.addEventListener('submit', onNoticeFormSubmit, false);
  };

  // Первичная синхронизация селектов количества комнат и гостей
  window.synchronizeFields(roomsValueSelect, capacitySelect, roomsValue, maxGuests, setValue);

  window.form = {
    activateNoticeForm: activateNoticeForm,
    setAddressCoordinates: setAddressCoordinates
  };
}());
