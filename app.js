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
let hourTemp = document.querySelectorAll('.card-title');
let hourTime = document.querySelectorAll('.card-text');

const convertToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

const formatTime = (timeString) => {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const time = new Date(timeString).toLocaleTimeString(undefined, options);
  return time.replace(/:\d+ /, ' '); // Remove seconds from the time
};

const getWeather = async (e) => {
  if (e) {
    e.preventDefault();
  }

  const city = cityInput.value;
  locatCity.innerHTML = city;
  let apiKey = "6a4cbf1391b25dc54e0c049f56762069";
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const apiHour = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  try {
    let response = await fetch(api);
    let data = await response.json();
    let responseHour = await fetch(apiHour);
    let dataHour = await responseHour.json();
    
    const mainTempKelvinHour = dataHour.list[0].main.temp;
    const mainTempKelvinHour1 = dataHour.list[1].main.temp;
    const mainTempKelvinHour2 = dataHour.list[2].main.temp;
    const mainTempKelvinHour3 = dataHour.list[3].main.temp;
    const mainTempKelvinHour4 = dataHour.list[4].main.temp;
    const mainTempKelvinHour5 = dataHour.list[5].main.temp;
    const mainTempKelvinHour6 = dataHour.list[6].main.temp;
    const mainTempKelvin = data.main.temp;
    const minTempKelvin = data.main.temp_min;
    const maxTempKelvin = data.main.temp_max;
    const feelsLikeKelvin = data.main.feels_like;

    const mainTempCelsius2 = Math.round(mainTempKelvinHour - 273.15);
    const mainTempCelsius3 = Math.round(mainTempKelvinHour1 - 273.15);
    const mainTempCelsius4 = Math.round(mainTempKelvinHour2 - 273.15);
    const mainTempCelsius5 = Math.round(mainTempKelvinHour3 - 273.15);
    const mainTempCelsius6 = Math.round(mainTempKelvinHour4 - 273.15);
    const mainTempCelsius7 = Math.round(mainTempKelvinHour5 - 273.15);
    const mainTempCelsius8 = Math.round(mainTempKelvinHour6 - 273.15);
    const mainTempCelsius = Math.round(mainTempKelvin - 273.15);
    const minTempCelsius = Math.round(minTempKelvin - 273.15);
    const maxTempCelsius = Math.round(maxTempKelvin - 273.15);
    const feelsLikeCelsius = Math.round(feelsLikeKelvin - 273.15);

    hourTemp[0].innerHTML = mainTempCelsius2 + "&deg";
    hourTemp[1].innerHTML = mainTempCelsius3 + "&deg";
    hourTemp[2].innerHTML = mainTempCelsius4 + "&deg";
    hourTemp[3].innerHTML = mainTempCelsius5 + "&deg";
    hourTemp[4].innerHTML = mainTempCelsius6 + "&deg";
    hourTemp[5].innerHTML = mainTempCelsius7 + "&deg";
    hourTemp[6].innerHTML = mainTempCelsius8 + "&deg";

    hourTime[0].innerHTML = formatTime(dataHour.list[0].dt_txt);
    hourTime[1].innerHTML = formatTime(dataHour.list[1].dt_txt);
    hourTime[2].innerHTML = formatTime(dataHour.list[2].dt_txt);
    hourTime[3].innerHTML = formatTime(dataHour.list[3].dt_txt);
    hourTime[4].innerHTML = formatTime(dataHour.list[4].dt_txt);
    hourTime[5].innerHTML = formatTime(dataHour.list[5].dt_txt);
    hourTime[6].innerHTML = formatTime(dataHour.list[6].dt_txt);

    tempFeel.innerHTML = "Feels-Like " + feelsLikeCelsius + "°C";
    sta.innerHTML = "Status - " + data.weather[0].main;
    temp.innerHTML = "Temperature " + mainTempCelsius + "°C";
    min.innerHTML = minTempCelsius + "°C";
    max.innerHTML = maxTempCelsius + "°C";
    press.innerHTML = data.main.pressure + " hPa";
    humid.innerHTML = data.main.humidity + "%";
  } catch (error) {
    console.log(error);
  }
};

btn.addEventListener('click', getWeather);

getWeather();
