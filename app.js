var cityInput = document.querySelector('.form-control');
var btn = document.querySelector('.btn_success');
var locatCity = document.querySelector('.location');
let sta = document.querySelector('.status');
let temp = document.querySelector('.temp');
let tempFeel = document.querySelector('.tempFeel');
let min = document.querySelector('.min');
let max = document.querySelector('.max');
let press = document.querySelector('.press');
let humid = document.querySelector('.humid');



const convertToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

const getWeather = async (e) => {
  if (e) {
    e.preventDefault();
  }

  const city = cityInput.value;
  locatCity.innerHTML = city;

  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6a4cbf1391b25dc54e0c049f56762069`;

  try {
    let response = await fetch(api);
    let data = await response.json();

    const mainTempKelvin = data.main.temp;
    const minTempKelvin = data.main.temp_min;
    const maxTempKelvin = data.main.temp_max;
    const feelsLikeKelvin = data.main.feels_like;

    const mainTempCelsius = Math.round(mainTempKelvin - 273.15);
    const minTempCelsius = Math.round(minTempKelvin - 273.15);
    const maxTempCelsius = Math.round(maxTempKelvin - 273.15);
    const feelsLikeCelsius = Math.round(feelsLikeKelvin - 273.15);

    const status = data.weather[0].main;
    const pressure = data.main.pressure;
    const humidity = data.main.humidity;

    tempFeel.innerHTML = "Feels-Like "+feelsLikeCelsius + "°C";
    sta.innerHTML = "Status - "+status;
    temp.innerHTML ="Temperature " + mainTempCelsius + "°C";
    min.innerHTML = minTempCelsius + "°C";
    max.innerHTML = maxTempCelsius + "°C";
    press.innerHTML = pressure +" hPa";
    humid.innerHTML = humidity +"%";

  } catch (error) {
    console.log(error);
  }
};

btn.addEventListener('click', getWeather);

getWeather();
