'use strict';

(function () {
  // Допустимые форматы изображения
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  // Контейнер для фотогалереи
  var photoContainer = document.querySelector('.form__photo-container');
  // Шаблон
  var template = document.querySelector('template');
  // Контейнер для фотографий в галерее
  var gallery = document.createElement('ul');
  gallery.classList.add('gallery');
  // Шаблон элемента галереи
  var galleryItemTemplate = template.content.querySelector('.gallery__item');

  // Создание контейнера для загруженных изображений
  var initializeGallery = function () {
    photoContainer.appendChild(gallery);
  };

  /**
   * Добавление изображения на страницу
   * @param {string} src - картинка в base64
   */
  var addImage = function (src) {
    var galleryItem = galleryItemTemplate.cloneNode(true);
    var galleryImage = galleryItem.querySelector('.gallery__image');

    galleryImage.src = src;

    gallery.appendChild(galleryItem);
    if (gallery.children.length === 1) {
      gallery.children[0].classList.add('gallery__item--wide');
    } else if (gallery.children.length > 1) {
      Array.prototype.forEach.call(gallery.children, function (child) {
        child.classList.remove('gallery__item--wide');
      });
    }
  };

  /**
   * Удаление из формы добавленного изображениф по клику на кнопке на изображении
   * @param {Object} event
   */
  var removeImage = function (event) {
    var galleryButton = event.target.closest('button');

    if (galleryButton) {
      var image = galleryButton.parentNode;
      gallery.removeChild(image);

      if (gallery.children.length === 1) {
        gallery.firstChild.classList.add('gallery__item--wide');
      }
    }
  };

  // Предпросмотр аватара
  var avatarPreview = document.querySelector('.notice__preview img');
  // Адрес аватара по умолчанию
  var defaultAvatar = avatarPreview.src;

  // Сброс всех изображений в дефолтное состояние
  var resetFormImages = function () {
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    avatarPreview.src = defaultAvatar;
  };

  gallery.addEventListener('click', function (event) {
    removeImage(event);
  }, false);

  /**
   * Проверка формата изображения
   * @param {File} data
   * @return {boolean}
   */
  var checkFilesFormat = function (data) {
    data = data || 'none';
    var fileName = data.name.toLowerCase();

    var isCorrect = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    if (!isCorrect) {
      window.util.showMessage('Неверный формат изображения');
    }

    return isCorrect;
  };

  // Поле загрузки аватара (скрытый input[type=file])
  var avatarInput = document.querySelector('#avatar');

  // Обработчик события 'change' поля загрузки аватара
  var onAvatarInputChange = function () {
    var reader = new FileReader();
    var image = avatarInput.files[0];

    if (checkFilesFormat(image)) {
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
    }

    reader.readAsDataURL(image);
  };

  // Поле загрузки фотографий жилья (скрытый input[type=file])
  var photoInput = document.querySelector('#images');

  // Обработчик события 'change' поля загрузки фотографий
  var onPhotoInputChange = function () {
    var reader = new FileReader();
    var image = photoInput.files[0];

    if (checkFilesFormat(image)) {
      reader.addEventListener('load', function () {
        addImage(reader.result);
      });
    }

    reader.readAsDataURL(image);
  };

  /**
   * Обработчик события 'drop'
   * @param {Object} event
   */
  var onDrop = function (event) {
    var reader = new FileReader();
    var image = event.dataTransfer.files[0];

    if (event.target === avatarDropZone && checkFilesFormat(image)) {
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });
    }

    if (event.target === photoDropZone && checkFilesFormat(image)) {
      reader.addEventListener('load', function () {
        addImage(reader.result);
      });
    }

    reader.readAsDataURL(image);
  };

  avatarInput.addEventListener('change', onAvatarInputChange, false);
  photoInput.addEventListener('change', onPhotoInputChange, false);

  // Дропзона аватара
  var avatarDropZone = document.querySelector('#avatar-drop-zone');

  avatarDropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    return false;
  }, false);

  avatarDropZone.addEventListener('drop', function (event) {
    if (event.target.closest('fieldset').disabled !== true) {
      onDrop(event);
    }
  });

  // Дропзона в блоке загрузки фотографий
  var photoDropZone = document.querySelector('#images-drop-zone');

  photoDropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    return false;
  }, false);

  photoDropZone.addEventListener('drop', function (event) {
    if (event.target.closest('fieldset').disabled !== true) {
      onDrop(event);
    }
  }, false);

  // Отключение поведения по умолчанию на случай случайного отпускания файла не в дропзоне
  window.addEventListener('drop', function (event) {
    event.preventDefault();
  }, false);

  window.addEventListener('dragover', function (event) {
    event.preventDefault();
  }, false);

  window.photo = {
    resetFormImages: resetFormImages,
    initializeGallery: initializeGallery
  };
})();
