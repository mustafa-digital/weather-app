import { format } from 'date-fns';

// char code for degree symbol
const deg = String.fromCharCode(176);

const NUM_HOURS = 12;
const DAYS_FORECAST = 3;

// metric units
export const unitsM = {
  degree: deg + 'C',
  speed: 'kph',
  distance: 'km',
  pressure: 'mb'
}

// imperial units
export const unitsI = {
  degree: deg + 'F',
  speed: 'mph',
  distance: 'mi',
  pressure: 'in'
}

export function getDataObjects (data) {
  // Fill the celsius object with celsius data
  const dataC = {

    // location information
    location: {
      city: data.location.name,
      region: data.location.region,
      country: data.location.country
    },
    // current weather information
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
    // hourly forecast (12 hours), objects initialized
    hourly: [
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
    ],
    // 3 day forecast data
    forecast: [{}, {}, {}]
  }

  // fahrenheit data
  const dataF = {
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

  // fill in the hourly information into each hourly array object
  let day = 0;
  let hour = dataC.current.currentHour + 1;

  for (let i = 0; i < NUM_HOURS; i++) {
    const date = new Date(data.forecast.forecastday[day].hour[hour].time); // get the date for that time

    hour = hour + 1; // increase the hour every loop

    // if hours spill into the next day, reset the hours and update day to second day
    if ((day === 0) && (hour > 23)) {
      hour = 0;
      day = 1;
    }

    // fill in the hours and days
    dataC.hourly[i].hour = format(date, 'p');
    dataC.hourly[i].day = format(date, 'iii');
    dataF.hourly[i].hour = format(date, 'p');
    dataF.hourly[i].day = format(date, 'iii');

    // fill in temp data
    dataC.hourly[i].temp = data.forecast.forecastday[day].hour[hour].temp_c + unitsM.degree;
    dataC.hourly[i].feelsLike = data.forecast.forecastday[day].hour[hour].feelslike_c + unitsM.degree;
    dataC.hourly[i].icon = data.forecast.forecastday[day].hour[hour].condition.icon;
    dataC.hourly[i].condition = data.forecast.forecastday[day].hour[hour].condition.text;

    dataF.hourly[i].temp = data.forecast.forecastday[day].hour[hour].temp_f + unitsI.degree;
    dataF.hourly[i].feelsLike = data.forecast.forecastday[day].hour[hour].feelslike_f + unitsI.degree;
    dataF.hourly[i].icon = data.forecast.forecastday[day].hour[hour].condition.icon;
    dataF.hourly[i].condition = data.forecast.forecastday[day].hour[hour].condition.text;
  }

  console.log(data);
  // fill in data for three day forecast
  for (let i = 0; i < DAYS_FORECAST; i++) {
    const date = new Date(data.forecast.forecastday[day].hour[hour].time);

    dataC.forecast[i].day = format(date, 'iii');
    dataF.forecast[i].day = format(date, 'iii');

    // for 3 day forecast, get avg, low and high temps for that day
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

  return { dataC, dataF }
}
