import 'js-toggle-switch/dist/toggle-switch.min.css';
import ToggleSwitch from 'js-toggle-switch/dist/toggle-switch.min.js';
import './reset.css';
import './style.css';
import logoIconSrc from './assets/images/3521354_summer_sun_sunny_sunset_icon.png';
import searchIconSrc from './assets/icons/magnify.svg';
import { getDataObjects, unitsM, unitsI } from './data';

const logo = document.querySelector('.logo');
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('form');
const searchElem = document.querySelector('input[type="search"]');
const toggleSwitch = new ToggleSwitch('input[name="unit-toggle"]');
const autocompList = document.getElementById('autocomp');
const unitToggle = document.querySelector('input[name="unit-toggle"]');

const apiKey = '810eb340de0342aba89234651242301';
const baseURL = 'https://api.weatherapi.com/v1/forecast.json';
const searchURL = 'https://api.weatherapi.com/v1/search.json';

let unitMode = 'C';
let searchIndex = -1;

async function getWeatherData (request) {
  const response = await fetch(request);

  if (response.status === 200) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.status);
}

function displayWeather ({ dataC, dataF }) {
  let displayData;
  unitMode === 'C' ? displayData = dataC : displayData = dataF;
  const location = document.querySelector('.location');
  const time = document.querySelector('.time');
  const currentTemp = document.querySelector('.current-temp');
  const tempUnit = document.querySelector('.temp-unit');
  const feelsLike = document.querySelector('.feels-like');
  const weatherImg = document.querySelector('.current-weather-img');
  const currentCondition = document.querySelector('.current-condition');
  const wind = document.querySelector('.wind-val');
  const windDir = document.querySelector('.wind-dir');
  const humidity = document.querySelector('.humidity-val');
  const visibility = document.querySelector('.visibility-val');
  const sunrise = document.querySelector('.sunrise-val');
  const gust = document.querySelector('.gust-val');
  const pressure = document.querySelector('.pressure-val');
  const uv = document.querySelector('.uv-val');
  const sunset = document.querySelector('.sunset-val');

  const hourly = Array.from(document.querySelectorAll('.hourly'));
  const forecastWeek = Array.from(document.querySelectorAll('.forecast'));

  if (displayData.location.region !== '') {
    location.textContent = displayData.location.city + ', ' + displayData.location.region + ', ' + displayData.location.country;
  } else {
    location.textContent = displayData.location.city + ', ' + displayData.location.country;
  }

  time.textContent = displayData.current.time;
  currentTemp.textContent = displayData.current.temp;
  tempUnit.textContent = unitMode === 'C' ? unitsM.degree : unitsI.degree;
  feelsLike.textContent = 'Feels like: ' + displayData.current.feelsLike;

  weatherImg.src = displayData.current.icon;
  weatherImg.alt = displayData.current.condition;
  currentCondition.textContent = displayData.current.condition;

  wind.textContent = displayData.current.wind;
  windDir.textContent = displayData.current.windDir;
  humidity.textContent = displayData.current.humidity;
  visibility.textContent = displayData.current.vis;
  sunrise.textContent = displayData.current.sunrise;
  gust.textContent = displayData.current.gust;
  pressure.textContent = displayData.current.pressure;
  uv.textContent = displayData.current.uv;
  sunset.textContent = displayData.current.sunset;

  hourly.forEach(hour => {
    const i = hour.dataset.hour;
    const day = hour.querySelector('.hourly-day');
    const hourlyHour = hour.querySelector('.hourly-hour');
    // const condi = hour.querySelector('.hourly-condition');
    const icon = hour.querySelector('.hourly-icon');
    const temp = hour.querySelector('.hourly-temp');
    const feelsLike = hour.querySelector('.hourly-feelslike');

    day.textContent = displayData.hourly[i].day;
    hourlyHour.textContent = displayData.hourly[i].hour;
    // condi.textContent = displayData.hourly[i].condition;
    icon.src = displayData.hourly[i].icon;
    icon.alt = displayData.hourly[i].condition;
    temp.textContent = displayData.hourly[i].temp;
    feelsLike.textContent = 'Feels like: ' + displayData.hourly[i].feelsLike;
  });

  forecastWeek.forEach(forecast => {
    const i = Number(forecast.dataset.day);
    const day = forecast.querySelector('.forecast-day');
    const avgTemp = forecast.querySelector('.forecast-avg');
    const minTemp = forecast.querySelector('.forecast-min');
    const maxTemp = forecast.querySelector('.forecast-max');
    const icon = forecast.querySelector('.forecast-icon');
    const condi = forecast.querySelector('.forecast-condition');

    (i === 0) ? day.textContent = 'Today' : day.textContent = displayData.forecast[i].day;
    avgTemp.textContent = 'Avg: ' + displayData.forecast[i].avg;
    minTemp.textContent = 'Low: ' + displayData.forecast[i].min;
    maxTemp.textContent = 'High: ' + displayData.forecast[i].max;
    icon.src = displayData.forecast[i].icon;
    icon.alt = displayData.forecast[i].condition;
    condi.textContent = displayData.forecast[i].condition;
  });
}

/* Removes all selections - this is done to refresh the selections when autocomplete list is closed by clicking away */
function removeSelections () {
  const locations = document.querySelectorAll('.autocomp-suggestion');
  Array.from(locations).forEach(loc => {
    if (loc.classList.contains('selected')) { loc.classList.remove('selected'); }
  });
}

/* Adds selected class to the appropriate autocomplete suggestion  */
function selectFromList (locations) {
  // removes previous selected element
  Array.from(locations).forEach(loc => {
    if (loc.classList.contains('selected')) { loc.classList.remove('selected'); }
  });
  // adds selected to new element
  locations[searchIndex].classList.add('selected');
}

/* This function handles the down key press for autocomplete navigation
   Increases index, then changes the 'selected' element
*/
function handleDown (length, locations) {
  searchIndex = (searchIndex + 1) % length;
  selectFromList(locations);
}

/* This function handles the up key press for autocomplete navigation
   Decreases index, then changes the 'selected' element
*/
function handleUp (length, locations) {
  if (searchIndex === -1) searchIndex = 0;
  searchIndex = (length + (searchIndex - 1)) % length;
  selectFromList(locations);
}

/* Key handler for up and down keys to navigate the autocomplete suggestions */
function handleKeyDown (e) {
  const locations = document.querySelectorAll('.autocomp-suggestion');
  const { key } = e;
  const length = locations.length;

  if (key === 'ArrowUp') handleUp(length, locations);
  if (key === 'ArrowDown') handleDown(length, locations);
  if (key === 'Enter' && searchIndex !== -1) {
    updatePage(locations[searchIndex].textContent, true);
  };
}
searchElem.addEventListener('keydown', handleKeyDown);

// event listener for search input element
// each change to input does a search API call to get autocomplete data
searchElem.addEventListener('input', e => {
  autocompList.style.visibility = 'visible';
  autocompList.textContent = '';
  const query = searchElem.value;

  if (query) {
    updateSearch(query);
  }
});

/* Hide the auto complete list if it is on the screen and the user has clicked away
   Checks if mouse click is outside the autocomplete dimensions, if true, hides autocomplete
*/
window.addEventListener('click', e => {
  if (autocompList.style.visibility === 'hidden' || e.target === searchElem) return;
  const boxDimensions = autocompList.getBoundingClientRect();
  if (
    e.clientX < boxDimensions.left ||
    e.clientX > boxDimensions.right ||
    e.clientY < boxDimensions.top ||
    e.clientY > boxDimensions.bottom
  ) {
    autocompList.style.visibility = 'hidden';
    searchIndex = -1;
    removeSelections();
  }
});

/* This event listener listens to when the search bar gains focus, and toggles autocomplete list visibility on */
searchElem.addEventListener('focusin', e => {
  if (autocompList.textContent !== '') { autocompList.style.visibility = 'visible'; }
})

searchForm.addEventListener('submit', e => {
  e.preventDefault(); // prevents page refresh

  const query = searchElem.value;
  if (query && searchIndex !== -1) updatePage(query);
});

unitToggle.addEventListener('change', e => {
  unitMode === 'C' ? unitMode = 'F' : unitMode = 'C';
  displayWeather();
});
/* This function takes a query and calls the search API to get a list of locations for autocomplete */
function updateSearch (query) {
  query = query.replaceAll(' ', '%20'); // replace spaces with the string character for urls
  const requestURL = searchURL + '?key=' + apiKey + '&q=' + query;
  const request = new Request(requestURL, { mode: 'cors' });
  getWeatherData(request).then(data => {
    Array.from(data).forEach(location => {
      // create a list item
      const listItem = document.createElement('li');
      listItem.classList.add('autocomp-suggestion');

      // get location name
      let locationName;
      if (location.region) {
        locationName = location.name + ', ' + location.region + ', ' + location.country;
      } else {
        locationName = location.name + ', ' + location.country;
      }
      listItem.textContent = locationName;

      // on list item click, it will get weather data for this location
      listItem.addEventListener('click', e => {
        updatePage(locationName, true);
      });
      autocompList.appendChild(listItem);
    })
  });
}

/* This function takes a query, creates a request object from that query, and calls the forecast weather API
   If the data is retrieved, it updates the local data and updates the screen
   If fetching failed, it throws an error and alerts the user

   search variable is a boolean for refreshing autocomplete list
*/
function updatePage (query, search = false) {
  const name = query; // name is used to show the location name in the search bar
  query = query.replaceAll(' ', '%20'); // replace spaces with the string character for urls

  // create the request and send the request
  const requestURL = baseURL + '?key=' + apiKey + '&q=' + query + '&days=3';
  const request = new Request(requestURL, { mode: 'cors' });
  getWeatherData(request).then(data => {
    const filteredData = getDataObjects(data);
    displayWeather(filteredData);

    if (search) {
      searchElem.value = name;
      autocompList.textContent = '';
      autocompList.style.visibility = 'hidden';
    }
  })
    .catch(err => {
      console.error(err);
      alert('Sorry, could not find this location.');
    });
}

/* Initial page load, shows weather for london, ontario */
document.addEventListener('DOMContentLoaded', e => {
  // add urls to images
  logo.src = logoIconSrc;
  searchIcon.src = searchIconSrc;

  updatePage('london%20ontario');
});
