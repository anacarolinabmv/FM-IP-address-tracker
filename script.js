'use strict';

const IPAdressEl = document.getElementById('ip--address');
const locationEl = document.getElementById('location');
const timezoneEl = document.getElementById('timezone');
const ispEl = document.getElementById('isp');

const inputSearch = document.querySelector('.input--search');
const btnSearch = document.querySelector('.btn--search');

let map;

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const initMap = async function () {
  try {
    const geolocationResp = await getCurrentLocation();
    const { latitude: lat, longitude: lng } = geolocationResp.coords;
    map = L.map('map', { zoomControl: false }).setView([lat, lng], 16);
    L.marker([lat, lng]).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_koRC5qY2rJFwTOq83X1z63HWqIfmc`;

    displayTrackerInfo(apiURL);
  } catch (err) {
    alert(`Something went wrong. ${err.message}`);
  }
};
initMap();

const renderLocationOnMap = function (lat, lng) {
  map.panTo([lat, lng], 16);
  L.marker([lat, lng]).addTo(map);
};

const displayTrackerInfo = async function (apiURL, renderLocationFn) {
  try {
    const request = await fetch(apiURL);
    if (!request.ok) throw new Error('Could not get IP address information');
    const response = await request.json();

    if (renderLocationFn) {
      const { lat, lng } = response.location;
      renderLocationFn(lat, lng);
    }

    IPAdressEl.innerHTML = response.ip;
    locationEl.innerHTML = `${response.location.city}, ${response.location.region}, ${response.location.country}`;
    timezoneEl.innerHTML = `UTC ${response.location.timezone}`;
    ispEl.innerHTML = response.isp;
  } catch (err) {
    alert(`Something went wrong. ${err.message}`);
  }
};

const getIPDomain = function () {
  const input = inputSearch.value;

  const apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=at_koRC5qY2rJFwTOq83X1z63HWqIfmc&ipAddress=${input}&domain=${input}`;

  displayTrackerInfo(apiURL, renderLocationOnMap);
};

//Event Listeners

btnSearch.addEventListener('click', getIPDomain);

inputSearch.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  getIPDomain();
});
