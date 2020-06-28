export default function map() {
  let allMarkers = [
    { city: "Moscow", lat: 55.755246, lng: 37.623246, category: "russia" },
    {
      city: "StPetersburg",
      lat: 59.928421,
      lng: 30.313006,
      category: "Russia",
    },
    { city: "Saratov", lat: 51.546444, lng: 46.005824, category: "russia" },
    { city: "Kirovsk", lat: 67.648319, lng: 33.65728, category: "russia" },
    { city: "Tyumen", lat: 57.157769, lng: 65.54334, category: "russia" },
    { city: "Omsk", lat: 55.000395, lng: 73.363669, category: "russia" },
    { city: "Paris", lat: 48.860798, lng: 2.344856, category: "europe" },
    { city: "Prague", lat: 50.08639, lng: 14.414004, category: "europe" },
    { city: "London", lat: 51.481117, lng: -0.173702, category: "europe" },
    { city: "Rome", lat: 41.894663, lng: 12.484676, category: "europe" },
    { city: "Baku", lat: 40.395094, lng: 49.883454, category: "cis" },
    { city: "Tashkent", lat: 41.292895, lng: 69.249496, category: "cis" },
    { city: "Minsk", lat: 53.90303, lng: 27.565558, category: "cis" },
    { city: "Alma-Ata", lat: 43.223741, lng: 76.865075, category: "cis" },
  ];

  let markers = [];

  const checkboxs = document.querySelectorAll(".branches__checkbox");

  window.initMap = initMap;

  let categories = {
    russia: true,
    cis: true,
    europe: true,
  };

  checkboxs.forEach((item) => {
    item.addEventListener("change", () => {
      updateCategories(item);
      filterMarkers();
    });
  });

  function updateCategories({ value, checked }) {
    categories[value] = checked;
  }

  function filterMarkers() {
    markers.forEach((item) => {
      if (categories[item.category]) {
        item.setVisible(true);
      } else {
        item.setVisible(false);
      }
    });
  }

  function initMap() {
    let center = new google.maps.LatLng(56.804286, 60.644154);
    let mapOptions = {
      zoom: 5,
      center: center,
      disableDefaultUI: true,
    };

    let map = new google.maps.Map(document.querySelector(".map"), mapOptions);

    let zoomControlDiv = document.createElement("div");
    zoomControlDiv.classList.add("map__controls");
    let zoomControl = new ZoomControl(zoomControlDiv, map);

    zoomControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(zoomControlDiv);

    addYourLocationButton(map, zoomControlDiv);

    allMarkers.forEach((item) => {
      let marker = new google.maps.Marker({
        title: item.name,
        position: { lat: item.lat, lng: item.lng },
        category: item.category,
        map: map,
        icon: "img/map-marker.svg",
      });

      markers.push(marker);
    });
  }

  function addYourLocationButton(map, controlDiv) {
    let geolocationContainer = document.createElement("button");
    geolocationContainer.classList.add("map__geolocation-container");

    controlDiv.appendChild(geolocationContainer);

    let geolocation = document.createElement("div");
    geolocation.classList.add("map__geolocation");
    geolocationContainer.appendChild(geolocation);

    geolocationContainer.addEventListener("click", function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          let latlng = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          map.setCenter(latlng);
        });
      }
    });

    controlDiv.index = 1;
  }

  function ZoomControl(controlDiv, map) {
    let zoomControlsContainer = document.createElement("div");
    zoomControlsContainer.classList.add("map__zoom-controls-container");

    controlDiv.appendChild(zoomControlsContainer);

    let zoomInButton = document.createElement("div");
    zoomInButton.classList.add("map__zoom-in-button");

    zoomInButton.textContent = "+";
    zoomControlsContainer.appendChild(zoomInButton);

    let zoomOutButton = document.createElement("div");
    zoomOutButton.classList.add("map__zoom-out-button");
    zoomOutButton.textContent = "_";
    zoomControlsContainer.appendChild(zoomOutButton);

    google.maps.event.addDomListener(zoomInButton, "click", function () {
      map.setZoom(map.getZoom() + 1);
    });

    google.maps.event.addDomListener(zoomOutButton, "click", function () {
      map.setZoom(map.getZoom() - 1);
    });
  }
}
