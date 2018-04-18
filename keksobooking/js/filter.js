'use strict';

// фильтрация данных
(function () {
  var MIN_FILTER_PRICE = 10000;
  var MAX_FILTER_PRICE = 50000;

  var filterForm = document.querySelector('.map__filters');
  var housingType = filterForm.querySelector('#housing-type');
  var housingPrice = filterForm.querySelector('#housing-price');
  var housingRooms = filterForm.querySelector('#housing-rooms');
  var housingGuests = filterForm.querySelector('#housing-guests');
  var housingFeatureList = filterForm.querySelector('#housing-features');

  var getHousingRangeType = function (data) {
    return housingType.value === 'any' ? true : housingType.value === data.offer.type;
  };

  var getHousingRangePrice = function (data) {
    var rangePrice;
    switch (housingPrice.value) {
      case 'low': {
        rangePrice = data.offer.price < MIN_FILTER_PRICE;
        break;
      }
      case 'middle': {
        rangePrice = data.offer.price >= MIN_FILTER_PRICE && data.offer.price < MAX_FILTER_PRICE;
        break;
      }
      case 'high': {
        rangePrice = data.offer.price >= MAX_FILTER_PRICE;
        break;
      }
      default: {
        rangePrice = true;
      }
    }
    return rangePrice;
  };

  var getNeededElem = function (field, dataElem) {
    return field.value === 'any' ? true : field.value === (dataElem).toString();
  };

  var getHousingRangeRooms = function (data) {
    return getNeededElem(housingRooms, data.offer.rooms);
  };

  var getHousingRangeGuests = function (data) {
    return getNeededElem(housingGuests, data.offer.guests);
  };

  var getHousingRangeOffers = function (data) {
    var housingFeatures = housingFeatureList.querySelectorAll('input[type=checkbox]:checked');
    var inOffer = true;
    if (housingFeatures.length === 0) {
      inOffer = true;
    } else {
      housingFeatures.forEach(function (it) {
        if (data.offer.features.indexOf(it.value) === -1) {
          inOffer = false;
        }
      });
    }
    return inOffer;
  };

  var filterData = function (data) {
    return getHousingRangeType(data) && getHousingRangePrice(data) && getHousingRangeRooms(data) && getHousingRangeGuests(data) && getHousingRangeOffers(data);
  };

  window.filter = {
    getFilteredData: function (data) {
      var filteredData = [];
      filteredData = data.filter(filterData);
      return filteredData;
    }
  };
})();
