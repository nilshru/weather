const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
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
let precipate = document.querySelectorAll('.precipetate');
let Cdate = document.querySelectorAll('.Cdate')
let rain = document.querySelectorAll('.rain')
let toDayPrecipitate = document.querySelector('.toDayPrecipitate')
let degDay = document.querySelectorAll('.degDay')
let statusWeather = document.querySelectorAll('.statusWeather')

const convertToFahrenheit = (celsius) => {
  return (celsius * 9) / 5 + 32;
};

const formatTime = (timeString) => {
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const time = new Date(timeString).toLocaleTimeString(undefined, options);
  return time.replace(/:\d+ /, ' '); // Remove seconds from the time
};

const getWeather = async () => {
  let city = searchInput.value;
  const apiKey = '6a4cbf1391b25dc54e0c049f56762069'; // Replace with your OpenWeatherMap API key

  if (!city) {
    // If no city is specified, attempt to get the user's location
    try {
      const position = await getCurrentPosition();
      city = await getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      if (error.code === error.PERMISSION_DENIED) {
        // Location permission denied, show the allow location popup again
        requestLocationPermission();
      }
      console.error(error);
      return;
    }
  }

  locatCity.innerHTML = city;
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

    let responseHo = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coordLat}&longitude=${coordLon}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,rain,is_day`
    );
    let dataHo = await responseHo.json();

    let horTime = dataHo.hourly.time;
    hourTime.forEach((element, index) => {
      element.innerHTML = formatTime(horTime[index]);
    });

    let temprat = dataHo.hourly.temperature_2m;
    hourTemp.forEach((element, index) => {
      element.innerHTML = Math.floor(temprat[index]+1) + '&deg;';
    });

    precipate.forEach((element, index) => {
      element.innerHTML = '&#127783;' + dataHo.hourly.precipitation_probability[index] + '%';
    });
    ////////////////////////////////////////////////////////////////////////////////////////////
    let meteoResponce = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordLat}&longitude=${coordLon}&daily=precipitation_probability_max&timezone=GMT`)
    let meteoData = await meteoResponce.json();
    let meteoSevenDays = meteoData.daily.time;
    // console.log(meteoSevenDays);
    Cdate.forEach((element, index)=>{
      element.innerHTML = meteoSevenDays[index];
    });
    let sevenDaysPrecipatate = meteoData.daily.precipitation_probability_max;
    toDayPrecipitate.innerHTML = " " + sevenDaysPrecipatate[0] +"%" ///today
    rain.forEach((element, index)=>{
      element.innerHTML = sevenDaysPrecipatate[index] + "%";
    })
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  //  days call////////////////////////////////////////////////////
   
  const apiKeyday = '6a4cbf1391b25dc54e0c049f56762069';
  const apiUrlday = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKeyday}`;
   
  const responseday = await fetch(apiUrlday);
  const dataday = await responseday.json();

  const forecastData = [];
  const dates = new Set();

  dataday.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dates.has(date)) {
      forecastData.push({
        date: date,
        temperature: item.main.temp,
        weather: item.weather[0].main,
        
      });
      dates.add(date);
      if (forecastData.length === 5) {
        return;
      }
    }
  })
  degDay.forEach((element, index)=>{
    element.innerHTML = Math.round(forecastData[index].temperature-273.15) ;
  })
  statusWeather.forEach((element, index)=>{
    element.innerHTML = forecastData[index].weather ;
  })
  forecastData.forEach((element, index) => {
    const weatherIcon2 = getWeatherIcon(element.weather);
    statusWeather[index].innerHTML = weatherIcon2;
  })
  // console.log(forecastData[0].temperature);
  console.log(forecastData[0].weather);
   /////////////////////////////////////////////////////////
    const mainTempCelsius = Math.round(mainTempKelvin - 273.15);
    const minTempCelsius = Math.round(minTempKelvin - 273.15);
    const maxTempCelsius = Math.round(maxTempKelvin - 273.15);
    const feelsLikeCelsius = Math.round(feelsLikeKelvin - 273.15)+1;

    tempFeel.innerHTML = 'Feels ' + feelsLikeCelsius + '<sup class="supli2">°C</sup>';
    min.innerHTML = minTempCelsius + '°C';
    max.innerHTML = maxTempCelsius+2 + '°C';
    press.innerHTML = data.main.pressure + ' hPa';
    humid.innerHTML = data.main.humidity + '%';

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
    temp.innerHTML =Math.floor(currentTemperature)+1 +'<sup class="supli">&degC</sup>' ;

    // Scroll the card group to the current time with an additional 250px
    const cardGroup = document.querySelector('.card-gr');
    const currentCard = cardGroup.children[currentHourIndex];
    const scrollPosition = currentCard.offsetLeft - 60;
    cardGroup.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });

    // Set weather icon based on weather condition
    const weatherCondition = data.weather[0]?.main;
    const weatherIcon = getWeatherIcon(weatherCondition);
    sta.innerHTML = weatherIcon;
  } catch (error) {
    console.log(error);
  }
};

const getWeatherIcon = (weatherCondition) => {
  // Replace this with your own implementation or use a weather icon library/API
  if (weatherCondition === 'Clear') {
    return '&#9728;'; // Sun icon
  } else if (weatherCondition === 'Clouds') {
    return '&#9729;'; // Cloud icon
  } else if (weatherCondition === 'Rain') {
    return '&#x2614;'; // Rain icon
  } else if (weatherCondition === 'Snow') {
    return '&#9731;'; // Snowflake icon
  } else if (weatherCondition === 'Haze') {
    return '&#127787;'; // Haze icon
  } else if (weatherCondition === 'Thunderstorm') {
    return '&#9928;'; // Thunderstorm icon
  } else if (weatherCondition === 'Mist') {
    return '<i class="fa-solid fa-water"></i>'; // mist
  } else {
    return weatherCondition;
  }
};


const clearWeatherData = () => {
  locatCity.innerHTML = '';
  sta.innerHTML = '';
  temp.innerHTML = '';
  tempFeel.innerHTML = '';
  min.innerHTML = '';
  max.innerHTML = '';
  press.innerHTML = '';
  humid.innerHTML = '';
  hourTemp.forEach((element) => {
    element.innerHTML = '';
  });
  hourTime.forEach((element) => {
    element.innerHTML = '';
  });
  precipate.forEach((element) => {
    element.innerHTML = '';
  });
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error('Geolocation is not supported by this browser.'));
    }
  });
};

const getCityFromCoordinates = async (latitude, longitude) => {
  const apiKey = '6a4cbf1391b25dc54e0c049f56762069'; // Replace with your OpenWeatherMap API key
  const api = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

  try {
    let response = await fetch(api);
    if (!response.ok) {
      throw new Error('Failed to fetch city data');
    }
    let data = await response.json();
    return data[0]?.name;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const requestLocationPermission = () => {
  navigator.permissions
    .query({ name: 'geolocation' })
    .then((result) => {
      if (result.state === 'prompt') {
        // Show the allow location popup
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      }
    })
    .catch((error) => {
      console.error('Error requesting location permission:', error);
    });
};

searchInput.addEventListener('input', () => {
  clearWeatherData();
  const searchTerm = searchInput.value;
  if (searchTerm.length > 0) {
    fetchSuggestions(searchTerm)
      .then((suggestions) => {
        showSuggestions(suggestions);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    clearSuggestions();
  }
});

async function fetchSuggestions(searchTerm) {
  const apiKey = '6a4cbf1391b25dc54e0c049f56762069'; // Replace with your OpenWeatherMap API key
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }
  const data = await response.json();
  return data.map((item) => ({
    city: item.name,
    country: item.country,
    state: item.state,
  }));
}

function showSuggestions(suggestions) {
  suggestionsList.innerHTML = '';
  suggestions.forEach((suggestion) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="suggestion-city">${suggestion.city}</div>
      <div class="suggestion-details">
        <span class="suggestion-country">${suggestion.country}</span>,
        <span class="suggestion-state">${suggestion.state}</span>
      </div>
    `;
    li.addEventListener('click', () => {
      searchInput.value = suggestion.city;
      clearSuggestions();
      getWeather();
    });
    suggestionsList.appendChild(li);
  });
}

function clearSuggestions() {
  suggestionsList.innerHTML = '';
}


const btn = document.querySelector('.btn_success');
btn.addEventListener('click', () => {
  getWeather();
 
});

// requestLocationPermission();
getWeather();