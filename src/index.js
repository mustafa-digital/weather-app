import 'js-toggle-switch/dist/toggle-switch.min.css';
import ToggleSwitch from 'js-toggle-switch/dist/toggle-switch.min.js';
import './reset.css';
import './style.css';
import logoIconSrc from './assets/images/3521354_summer_sun_sunny_sunset_icon.png';
import searchIconSrc from './assets/icons/magnify.svg';
import { getDataObjects } from './data';
import { displayWeather, getLocationName } from './display';

const logo = document.querySelector('.logo');
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('form');
const searchElem = document.querySelector('input[type="search"]');
const toggleSwitch = new ToggleSwitch('input[name="unit-toggle"]'); // creates the toggle switch over the checkbox
const autocompList = document.getElementById('autocomp');
const unitToggle = document.querySelector('input[name="unit-toggle"]');

// variables used in weather API calls
const apiKey = '810eb340de0342aba89234651242301';
const baseURL = 'https://api.weatherapi.com/v1/forecast.json';
const searchURL = 'https://api.weatherapi.com/v1/search.json';

// Global Variables
let filteredData; // container for the fetched dataC and dataF
let unitMode = 'C'; // controls the current units to display
let searchIndex = -1; // index for the autocomplete search

/* This function sends a fetch request and returns with data if successful, throws an error if fetch fails */
async function getWeatherData (request) {
  const response = await fetch(request);

  if (response.status === 200) { // OK
    const data = await response.json();
    return data;
  }

  throw new Error(response.status);
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

/* This function listens for submit events on the search bar (ie. when enter is pressed)
   gets weather data and updates page for the user's query
*/
searchForm.addEventListener('submit', e => {
  e.preventDefault(); // prevents page refresh

  const query = searchElem.value;
  if (query && searchIndex !== -1) updatePage(query);
});

/* Toggles the unit toggle button to display the appropriate units */
unitToggle.addEventListener('change', e => {
  let displayData;
  unitMode === 'C' ? unitMode = 'F' : unitMode = 'C';
  unitMode === 'C' ? displayData = filteredData.dataC : displayData = filteredData.dataF;
  displayWeather(displayData);
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
      const locationName = getLocationName(location);
      // console.log(locationName);
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
    filteredData = getDataObjects(data);
    let displayData;
    unitMode === 'C' ? displayData = filteredData.dataC : displayData = filteredData.dataF;
    displayWeather(displayData);

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
