'use strict';

(function () {
  var CHECK_TIME = ['12:00', '13:00', '14:00'];
  var FLAT_TYPE = ['flat', 'house', 'palace', 'bungalo'];
  var FLAT_MIN_PRICE = ['1000', '5000', '10000', '0'];
  var FLAT_TOTAL_ROOM = ['1', '2', '3', '100'];
  var FLAT_CAPACITY = [['1'], ['1', '2'], ['1', '2', '3'], ['0']];
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;
  var MAX_PRICE = 1000000;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var noticeForm = document.querySelector('.notice__form');
  var noticeTitle = noticeForm.querySelector('#title');
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');

  noticeTitle.addEventListener('invalid', function (evt) {
    checkNoticeTitle(evt.target);
  });

  noticeTitle.addEventListener('keydown', function (evt) {
    checkNoticeTitle(evt.target);
  });

  var checkNoticeTitle = function (input) {
    if (input.validity.valueMissing || input.value === '') {
      input.setCustomValidity('Пожалуйста, заполните это поле');
      setErrorStyle(input);
    } else if (input.validity.tooLong || input.length > MAX_TITLE_LENGTH) {
      input.setCustomValidity('Заголовок не должен превышать 100 символов');
      setErrorStyle(input);
    } else if (input.validity.tooShort || input.value.length < MIN_TITLE_LENGTH) {
      input.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
      setErrorStyle(input);
    } else {
      removeErrorStyle(input);
    }
  };

  var setErrorStyle = function (elem) {
    elem.setAttribute('style', 'border:3px solid red');
  };

  var removeErrorStyle = function (elem) {
    elem.setCustomValidity('');
    elem.removeAttribute('style');
  };

  var noticeAddress = noticeForm.querySelector('#address');
  var checkAddressValidity = function (input) {
    if (input.validity.valueMissing || input.value === '') {
      input.setCustomValidity('Пожалуйста, выберите местоположение Вашего помещения на карте');
      setErrorStyle(input);
    } else {
      removeErrorStyle(input);
    }
  };

  noticeAddress.addEventListener('invalid', function (evt) {
    checkAddressValidity(evt.target);
  });

  // Синхронизация время выезда со временем въезда
  var noticeTimeIn = noticeForm.querySelector('#timein');
  var noticeTimeOut = noticeForm.querySelector('#timeout');
  var timeIn = CHECK_TIME;
  var timeOut = CHECK_TIME;

  var syncValues = function (element, value) {
    element.value = value;
  };

  noticeTimeIn.addEventListener('change', function () {
    window.synchronizeFields(noticeTimeIn, noticeTimeOut, timeIn, timeOut, syncValues);
  });

  noticeTimeOut.addEventListener('change', function () {
    window.synchronizeFields(noticeTimeOut, noticeTimeIn, timeOut, timeIn, syncValues);
  });

  // Синхронизация минимальной цены в зависимости от типа жилья

  var noticeType = noticeForm.querySelector('#type');
  var noticePrice = noticeForm.querySelector('#price');
  var minPrices = FLAT_MIN_PRICE;
  var flatTypes = FLAT_TYPE;

  // «Лачуга» — минимальная цена 0
  // «Квартира» — минимальная цена 1000
  // «Дом» — минимальная цена 5000
  // «Дворец» — минимальная цена 10000

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  noticeType.addEventListener('change', function () {
    window.synchronizeFields(noticeType, noticePrice, flatTypes, minPrices, syncValueWithMin);
  });

  var getMinPrice = function (value) {
    var index = flatTypes.indexOf(value);
    var minPrice = minPrices[index];
    return minPrice;
  };

  var checkPriceValidity = function (input) {
    var currentMinPrice = getMinPrice(noticeType.value);
    if (input.validity.valueMissing || input.value === '') {
      input.setCustomValidity('Пожалуйста, заполните это поле');
      setErrorStyle(input);
    } else if (input.validity.rangeUnderflow || input.value < currentMinPrice) {
      input.setCustomValidity('Минимальныя цена должна быть не ниже ' + currentMinPrice);
      setErrorStyle(input);
    } else if (input.validity.rangeOverflow || input.value > MAX_PRICE) {
      input.setCustomValidity('Максимальная цена должна быть ниже 1000000 ');
      setErrorStyle(input);
    } else {
      removeErrorStyle(input);
    }
  };

  noticePrice.addEventListener('invalid', function (evt) {
    checkPriceValidity(evt.target);
  });

  noticePrice.addEventListener('change', function (evt) {
    checkPriceValidity(evt.target);
  });

  // Количество комнат связано с количеством гостей:
  // 1 комната — «для одного гостя»
  // 2 комнаты — «для 2-х или 1-го гостя»
  // 3 комнаты — «для 2-х, 1-го или 3-х гостей»
  // 100 комнат — «не для гостей»
  // Синхронизация количество комнат с количеством гостей
  var noticeRoomNumber = noticeForm.querySelector('#room_number');
  var noticeCapacity = noticeForm.querySelector('#capacity');
  var roomNumbers = FLAT_TOTAL_ROOM;
  var flatCapacities = FLAT_CAPACITY;

  var syncFlatCapacity = function (element, values) {
    for (var i = 0; i < element.options.length; i++) {
      element.options[i].disabled = true;
    }
    for (i = 0; i < values.length; i++) {
      for (var j = 0; j < element.options.length; j++) {
        if (element.options[j].value === values[i]) {
          element.options[j].disabled = false;
          element.options[j].selected = true;
        }
      }
    }
  };

  noticeRoomNumber.addEventListener('change', function () {
    window.synchronizeFields(noticeRoomNumber, noticeCapacity, roomNumbers, flatCapacities, syncFlatCapacity);
  });

  // Проверка на заполнение обязательных полей
  var requiredFields = ['title', 'address', 'price'];
  var checkRequiredFields = function () {
    var error = false;
    requiredFields.forEach(function (fieldName) {
      var noticeFormRequiredField = noticeForm.querySelector('input[name=' + fieldName + ']');
      if (noticeFormRequiredField.value === '') {
        setErrorStyle(noticeFormRequiredField);
        error = true;
      }
    });
    return error;
  };

  var synchronizeNoticeFormFields = function () {
    window.synchronizeFields(noticeRoomNumber, noticeCapacity, roomNumbers, flatCapacities, syncFlatCapacity);
    window.synchronizeFields(noticeTimeIn, noticeTimeOut, timeIn, timeOut, syncValues);
    window.synchronizeFields(noticeType, noticePrice, flatTypes, minPrices, syncValueWithMin);
  };

  var onReset = function () {
    window.mainPin.moveToDefaultPlace();
    noticeForm.reset();
  };

  var onSuccess = function () {
    onReset();
    synchronizeNoticeFormFields();
  };

  noticeForm.addEventListener('submit', function (evt) {
    if (checkRequiredFields()) {
      evt.preventDefault();
    } else {
      window.backend.upload(new FormData(noticeForm), onSuccess, window.backend.onError);
      evt.preventDefault();
    }
  });

  // загрузка фотографий и аватарки пользователя
  var noticeFormAvatarChooser = noticeForm.querySelector('#avatar');
  var noticeFormAvatarPreviewer = noticeForm.querySelector('.notice__preview img');

  noticeFormAvatarChooser.addEventListener('change', function () {
    var file = noticeFormAvatarChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        noticeFormAvatarPreviewer.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  var noticeFormImagesChooser = noticeForm.querySelector('#images');
  var noticeFormPhoto = noticeForm.querySelector('.form__photo-container');

  noticeFormImagesChooser.addEventListener('change', function () {
    var file = noticeFormImagesChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var noticeImage = document.createElement('img');
        noticeImage.src = reader.result;
        noticeImage.width = '140';
        noticeImage.alt = 'Фотография помещения';
        noticeImage.style.cssText = 'margin: 5px 0 0; border-radius: 5px;';
        noticeFormPhoto.appendChild(noticeImage);
      });
      reader.readAsDataURL(file);
    }
  });

  window.form = {
    formOnLoad: function () {
      noticeForm.classList.toggle('notice__form--disabled', true);
      Array.prototype.forEach.call(noticeFormFieldsets, function (formFieldset) {
        formFieldset.disabled = true;
      });
      synchronizeNoticeFormFields();
    },

    disabledForm: function () {
      noticeForm.classList.remove('notice__form--disabled');
      Array.prototype.forEach.call(noticeFormFieldsets, function (formFieldset) {
        formFieldset.disabled = false;
      });
    }
  };
})();
