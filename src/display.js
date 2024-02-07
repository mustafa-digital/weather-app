export function displayWeather (data) {
  // update location header
  const location = document.querySelector('.location'); // location header
  location.textContent = getLocationName(data.location);

  updateCurrentTempCard(data);

  updateCurrentConditionsCard(data);

  updateHourlyCard(data);

  updateDayForecastCard(data);
}

export function getLocationName (location) {
  let city;
  location.city ? city = location.city : city = location.name;
  if (location.region !== '') { return (city + ', ' + location.region + ', ' + location.country); }

  return (city + ', ' + location.country);
}

function updateCurrentTempCard (data) {
// current temp card
  const time = document.querySelector('.time'); // current time - sub header
  const currentTemp = document.querySelector('.current-temp');
  const tempUnit = document.querySelector('.temp-unit');
  const feelsLike = document.querySelector('.feels-like');
  const weatherImg = document.querySelector('.current-weather-img');
  const currentCondition = document.querySelector('.current-condition');

  // update the current temp card elements
  time.textContent = data.current.time;
  currentTemp.textContent = data.current.temp;
  tempUnit.textContent = data.current.tempUnit;
  feelsLike.textContent = 'Feels like: ' + data.current.feelsLike;
  weatherImg.src = data.current.icon;
  weatherImg.alt = data.current.condition;
  currentCondition.textContent = data.current.condition;
}

function updateCurrentConditionsCard (data) {
  // current condition card
  const wind = document.querySelector('.wind-val');
  const windDir = document.querySelector('.wind-dir');
  const humidity = document.querySelector('.humidity-val');
  const visibility = document.querySelector('.visibility-val');
  const sunrise = document.querySelector('.sunrise-val');
  const gust = document.querySelector('.gust-val');
  const pressure = document.querySelector('.pressure-val');
  const uv = document.querySelector('.uv-val');
  const sunset = document.querySelector('.sunset-val');

  // update current condition card elements
  wind.textContent = data.current.wind;
  windDir.textContent = data.current.windDir;
  humidity.textContent = data.current.humidity;
  visibility.textContent = data.current.vis;
  sunrise.textContent = data.current.sunrise;
  gust.textContent = data.current.gust;
  pressure.textContent = data.current.pressure;
  uv.textContent = data.current.uv;
  sunset.textContent = data.current.sunset;
}

function updateHourlyCard (data) {
  const hourly = Array.from(document.querySelectorAll('.hourly'));

  hourly.forEach(hour => {
    const i = hour.dataset.hour;
    const day = hour.querySelector('.hourly-day');
    const hourlyHour = hour.querySelector('.hourly-hour');
    const icon = hour.querySelector('.hourly-icon');
    const temp = hour.querySelector('.hourly-temp');
    const feelsLike = hour.querySelector('.hourly-feelslike');

    day.textContent = data.hourly[i].day;
    hourlyHour.textContent = data.hourly[i].hour;
    icon.src = data.hourly[i].icon;
    icon.alt = data.hourly[i].condition;
    temp.textContent = data.hourly[i].temp;
    feelsLike.textContent = 'Feels like: ' + data.hourly[i].feelsLike;
  });
}

function updateDayForecastCard (data) {
  const forecastWeek = Array.from(document.querySelectorAll('.forecast'));

  forecastWeek.forEach(forecast => {
    const i = Number(forecast.dataset.day);
    const day = forecast.querySelector('.forecast-day');
    const avgTemp = forecast.querySelector('.forecast-avg');
    const minTemp = forecast.querySelector('.forecast-min');
    const maxTemp = forecast.querySelector('.forecast-max');
    const icon = forecast.querySelector('.forecast-icon');
    const condi = forecast.querySelector('.forecast-condition');

    (i === 0) ? day.textContent = 'Today' : day.textContent = data.forecast[i].day;
    avgTemp.textContent = 'Avg: ' + data.forecast[i].avg;
    minTemp.textContent = 'Low: ' + data.forecast[i].min;
    maxTemp.textContent = 'High: ' + data.forecast[i].max;
    icon.src = data.forecast[i].icon;
    icon.alt = data.forecast[i].condition;
    condi.textContent = data.forecast[i].condition;
  });
}
