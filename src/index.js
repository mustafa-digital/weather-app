import 'js-toggle-switch/dist/toggle-switch.min.css';
import ToggleSwitch from 'js-toggle-switch/dist/toggle-switch.min.js';
import { format } from 'date-fns';
import './reset.css';
import './style.css';
import logoIconSrc from './assets/images/3521354_summer_sun_sunny_sunset_icon.png';
import searchIconSrc from './assets/icons/magnify.svg';

const logo = document.querySelector('.logo');
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('form');
const searchElem = document.querySelector('input[type="search"]');
const apiKey = '810eb340de0342aba89234651242301';
const baseURL = 'https://api.weatherapi.com/v1/forecast.json';
const toggleSwitch = new ToggleSwitch('input[name="unit-toggle"]');
const unitToggle = document.querySelector('input[name="unit-toggle"]');
let unitMode = 'C';
const deg = String.fromCharCode(176);
const unitsM = {
  degree: deg + 'C',
  speed: 'kph',
  distance: 'km',
  pressure: 'mb'
}
const unitsI = {
  degree: deg + 'F',
  speed: 'mph',
  distance: 'mi',
  pressure: 'in'
}

let dataC = {};
let dataF = {};

logo.src = logoIconSrc;
searchIcon.src = searchIconSrc;

async function getWeatherData (request) {
  const response = await fetch(request);

  if (response.status === 200) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.status);
}

function updateWeather (data) {
  dataC = {
    location: {
      city: data.location.name,
      region: data.location.region,
      country: data.location.country
    },
    current: {
      time: format(new Date(data.location.localtime), 'eeee, LLLL d, p'),
      currentHour: (new Date(data.location.localtime)).getHours(),
      temp: data.current.temp_c,
      feelsLike: data.current.feelslike_c + unitsM.degree,
      gust: data.current.gust_kph + unitsM.speed,
      humidity: data.current.humidity + '%',
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      uv: data.current.uv,
      vis: data.current.vis_km + unitsM.distance,
      windDeg: data.current.wind_degree,
      windDir: data.current.wind_dir,
      wind: data.current.wind_kph + unitsM.speed,
      pressure: data.current.pressure_mb + unitsM.pressure,
      cloudy: data.current.cloud,
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset
    },
    hourly: [
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
    ],
    forecast: [{}, {}, {}, {}, {}, {}, {}]
  }

  dataF = {
    location: {
      city: data.location.name,
      region: data.location.region,
      country: data.location.country
    },
    current: {
      time: format(new Date(data.location.localtime), 'eeee, LLLL d, p'),
      currentHour: (new Date(data.location.localtime)).getHours(),
      temp: data.current.temp_f,
      feelsLike: data.current.feelslike_f + unitsI.degree,
      gust: data.current.gust_mph + unitsI.speed,
      humidity: data.current.humidity + '%',
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      uv: data.current.uv,
      vis: data.current.vis_miles + unitsI.distance,
      windDeg: data.current.wind_degree,
      windDir: data.current.wind_dir,
      wind: data.current.wind_mph + unitsI.speed,
      pressure: data.current.pressure_in + unitsI.pressure,
      cloudy: data.current.cloud,
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset
    },
    hourly: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    forecast: [{}, {}, {}, {}, {}, {}, {}]
  }

  let day = 0;
  let hour = dataC.current.currentHour + 1;

  for (let i = 0; i < 12; i++) {
    const date = new Date(data.forecast.forecastday[day].hour[hour].time);
    hour = hour + 1;
    if ((day === 0) && (hour > 23)) {
      hour = 0;
      day = 1;
    }
    dataC.hourly[i].hour = format(date, 'p');
    dataC.hourly[i].day = format(date, 'iii');
    dataF.hourly[i].hour = format(date, 'p');
    dataF.hourly[i].day = format(date, 'iii');

    dataC.hourly[i].temp = data.forecast.forecastday[day].hour[hour].temp_c + unitsM.degree;
    dataC.hourly[i].feelsLike = data.forecast.forecastday[day].hour[hour].feelslike_c + unitsM.degree;
    dataC.hourly[i].icon = data.forecast.forecastday[day].hour[hour].condition.icon;
    dataC.hourly[i].condition = data.forecast.forecastday[day].hour[hour].condition.text;

    dataF.hourly[i].temp = data.forecast.forecastday[day].hour[hour].temp_f + unitsI.degree;
    dataF.hourly[i].feelsLike = data.forecast.forecastday[day].hour[hour].feelslike_f + unitsI.degree;
    dataF.hourly[i].icon = data.forecast.forecastday[day].hour[hour].condition.icon;
    dataF.hourly[i].condition = data.forecast.forecastday[day].hour[hour].condition.text;
  }

  for (let i = 0; i < 3; i++) {
    const date = new Date(data.forecast.forecastday[day].hour[hour].time);

    dataC.forecast[i].day = format(date, 'iii');
    dataF.forecast[i].day = format(date, 'iii');

    dataC.forecast[i].avg = data.forecast.forecastday[i].day.avgtemp_c + unitsM.degree;
    dataC.forecast[i].min = data.forecast.forecastday[i].day.mintemp_c + unitsM.degree;
    dataC.forecast[i].max = data.forecast.forecastday[i].day.maxtemp_c + unitsM.degree;
    dataC.forecast[i].icon = data.forecast.forecastday[i].day.condition.icon;
    dataC.forecast[i].condition = data.forecast.forecastday[i].day.condition.text;

    dataF.forecast[i].avg = data.forecast.forecastday[i].day.avgtemp_f + unitsM.degree;
    dataF.forecast[i].min = data.forecast.forecastday[i].day.mintemp_f + unitsM.degree;
    dataF.forecast[i].max = data.forecast.forecastday[i].day.maxtemp_f + unitsM.degree;
    dataF.forecast[i].icon = data.forecast.forecastday[i].day.condition.icon;
    dataF.forecast[i].condition = data.forecast.forecastday[i].day.condition.text;
  }
}

function displayWeather (data) {
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

  if (displayData.location.region !== '') { location.textContent = displayData.location.city + ', ' + displayData.location.region + ', ' + displayData.location.country; } else { location.textContent = displayData.location.city + ', ' + displayData.location.country; }
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
    const condi = hour.querySelector('.hourly-condition');
    const icon = hour.querySelector('.hourly-icon');
    const temp = hour.querySelector('.hourly-temp');
    const feelsLike = hour.querySelector('.hourly-feelslike');

    day.textContent = displayData.hourly[i].day;
    hourlyHour.textContent = displayData.hourly[i].hour;
    condi.textContent = displayData.hourly[i].condition;
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

searchForm.addEventListener('submit', e => {
  e.preventDefault();

  const query = searchElem.value;

  if (query !== '') {
    const requestURL = baseURL + '?key=' + apiKey + '&q=' + query + '&days=9';

    const request = new Request(requestURL, { mode: 'cors' });
    getWeatherData(request).then(data => {
      updateWeather(data);
      displayWeather(data);
    })
      .catch(err => {
        console.error(err);
      });
  }
});

unitToggle.addEventListener('change', e => {
  unitMode === 'C' ? unitMode = 'F' : unitMode = 'C';
  displayWeather();
});

document.addEventListener('DOMContentLoaded', e => {
  const requestURL = baseURL + '?key=' + apiKey + '&q=london%20ontario' + '&days=9';

  const request = new Request(requestURL, { mode: 'cors' });
  getWeatherData(request).then(data => {
    console.log(data);
    updateWeather(data);
    displayWeather(data);
  })
    .catch(err => {
      console.error(err);
    });
});
