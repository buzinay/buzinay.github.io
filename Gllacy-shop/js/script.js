var myMap;
var myPlacemark;
ymaps.ready(init);
  function init () {
        myMap = new ymaps.Map('map-id', {
        center: [59.9394,30.33],
        zoom: 10,
        controls: ["zoomControl", "fullscreenControl"]
        });

        myPlacemark = new ymaps.Placemark([59.938631, 30.323055],{
          balloonContentBody: '',
    },{
        iconLayout: 'default#image',
        iconImageHref: 'img/pin.svg',
        iconImageSize: [100, 100],
        iconImageOffset: [-18, -18]
      });
    myMap.geoObjects.add(myPlacemark);
  }

var link = document.querySelector(".btn-contact");
var popup = document.querySelector(".feedback");
var overlay = document.querySelector(".feedback-overlay");
var close = popup.querySelector(".modal-close");

link.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.add("feedback-show");
  overlay.classList.add("feedback-overlay-show");
});

close.addEventListener("click", function(event) {
  event.preventDefault();
  popup.classList.remove("feedback-show");
  overlay.classList.remove("feedback-overlay-show");
});

window.addEventListener("keydown", function(event) {
  if (event.keyCode === 27) {
    if (popup.classList.contains("feedback-show")) {
        popup.classList.remove("feedback-show");
        overlay.classList.remove("feedback-overlay-show");
      }
    }
});
