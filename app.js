// JavaScript code
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
let precipate = document.querySelectorAll('.precipetate')

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

  try {
    let response = await fetch(api);
    let data = await response.json();

    const mainTempKelvin = data.main.temp;
    const minTempKelvin = data.main.temp_min;
    const maxTempKelvin = data.main.temp_max;
    const feelsLikeKelvin = data.main.feels_like;

    const coordLat = data.coord.lat;
    const coordLon = data.coord.lon;

    let responseHo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordLat}&longitude=${coordLon}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,rain,is_day`);
    let dataHo = await responseHo.json();

    let horTime = dataHo.hourly.time;
    hourTime.forEach((element, index) => {
      element.innerHTML = formatTime(horTime[index]);
    });

    let temprat = dataHo.hourly.temperature_2;
    hourTemp.forEach((element, index) => {
      element.innerHTML = temprat[index] + "&deg;";
    });

    precipate.forEach((element, index) => {
      element.innerHTML = "&#127783;" + dataHo.hourly.precipitation_probability[index] + "%";
    });

    const mainTempCelsius = Math.round(mainTempKelvin - 273.15);
    const minTempCelsius = Math.round(minTempKelvin - 273.15);
    const maxTempCelsius = Math.round(maxTempKelvin - 273.15);
    const feelsLikeCelsius = Math.round(feelsLikeKelvin - 273.15);

    tempFeel.innerHTML = "Feels-Like " + feelsLikeCelsius + "°C";
    sta.innerHTML = "Status - " + data.weather[0].main;
    min.innerHTML = minTempCelsius + "°C";
    max.innerHTML = maxTempCelsius + "°C";
    press.innerHTML = data.main.pressure + " hPa";
    humid.innerHTML = data.main.humidity + "%";
    
    // Get the current hour
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    // Find the index of the current hour in the hourly forecast data
    const currentHourIndex = dataHo.hourly.time.findIndex((time) => {
      const hour = new Date(time).getHours();
      return hour === currentHour;
    });
    const currentTemperature = dataHo.hourly.temperature_2m[currentHourIndex];

    // Display the current temperature
    temp.innerHTML =   "Temperature " + currentTemperature + "&deg;" + "C";

    
    // Scroll the card group to the current time with an additional 250px
    const cardGroup = document.querySelector('.card-gr');
    const currentCard = cardGroup.children[currentHourIndex];
    const scrollPosition = currentCard.offsetLeft -60;
    cardGroup.scroll({
      left: scrollPosition,
      behavior: 'smooth'
    });
    // temp.innerHTML = "Temperature " + mainTempCelsius + "&deg;";

  } catch (error) {
    console.log(error);
  }
};

btn.addEventListener('click', getWeather);

getWeather();
