const apiKey = 'c07aa11fc02e55dff21a6c7b5de6760e';
const search = document.getElementById('search');
const weatherInfo = document.querySelector('.weather-info');
const forecastContainer = document.querySelector('.forecast-container');

search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather(search.value);
        getForecast(search.value);
    }
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => updateWeatherInfo(data));
}

function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => updateForecast(data));
}

function getWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then((response) => response.json())
      .then((data) => updateWeatherInfo(data));
}

function getForecastByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then((response) => response.json())
      .then((data) => updateForecast(data));
}

function updateWeatherInfo(data) {
    const city = document.querySelector('.city');
    const temperature = document.querySelector('.temperature');
    const weatherIcon = document.querySelector('.weather-icon');
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const humidity = document.querySelector('.humidity');
    const windSpeed = document.querySelector('.wind-speed');
    const pressure = document.querySelector('.pressure');
    const description = document.querySelector('.description');
    const clothingSuggestion = document.querySelector('.clothing-suggestion');

    city.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherIcon.innerHTML = `<img src="${iconUrl}" alt="${data.weather[0].description}">`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    description.textContent = data.weather[0].description;

    const clothing = getClothingSuggestion(data.main.temp, data.weather[0].main);
    clothingSuggestion.innerHTML = `Suggested attire: `;
    
    const clothingText = document.createElement('span');
    clothingText.textContent = clothing.text;
    clothingSuggestion.appendChild(clothingText);

    for (const iconName of clothing.icons) {
        const clothingIcon = document.createElement('img');
        clothingIcon.src = `./assets/${iconName}`;
        clothingIcon.alt = clothing.text;
        clothingIcon.style.width = '70px';
        clothingSuggestion.appendChild(clothingIcon);
    }

    setBackground(data.weather[0].main);
}

function updateForecast(data) {
  forecastContainer.innerHTML = '';

  // Filter 3 days forecast at 2:00 PM
  const threeDayForecast = data.list.filter(item => {
    const date = new Date(item.dt * 1000);
    return date.getHours() === 14;
}).slice(0, 3);

for (const forecast of threeDayForecast) {
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');

    const date = new Date(forecast.dt * 1000);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    forecastDay.innerHTML = `
        <h3>${dayOfWeek}</h3>
        <div class="forecast-temperature">${Math.round(forecast.main.temp)}°C</div>
        <div class="forecast-icon"><img src="${iconUrl}" alt="${forecast.weather[0].description}"></div>
        <div class="forecast-description">${forecast.weather[0].description}</div>
    `;

    forecastContainer.appendChild(forecastDay);
}
}

function getClothingSuggestion(temp, weather) {
  if (weather.toLowerCase() === 'rain') {
      return { icons: ['raincoat2.svg', 'pants.svg'], text: 'raincoat and umbrella' };
  } else if (temp < 0) {
      return {icons: ['jacket.svg', 'pants3.svg'], text: 'heavy winter coat, gloves, scarf, and hat'};
  } else if (temp >= 0 && temp < 10) {
      return {icons: ['jacket2.svg', 'pants3.svg'], text: 'winter coat, gloves, and hat'};
  } else if (temp >= 10 && temp < 15) {
      return {icons: ['layers.svg', 'pants4.svg'], text: 'jacket and light layers'};
  } else if (temp >= 15 && temp < 21) {
      return {icons: ['hoodie.svg', 'pants.svg'], text: 'light jacket or sweater'};
  } else {
      return {icons: ['tshirt2.svg', 'shorts7.svg'], text: 'short sleeves and shorts or light pants'};
  }
}





function setBackground(weather) {
    const body = document.body;

    switch (weather.toLowerCase()) {
        case 'clear':
          body.style.backgroundColor = '#8ac6d1';
          break;
      case 'clouds':
          body.style.backgroundColor = '#a4b2bc';
          break;
      case 'rain':
          body.style.backgroundColor = '#59656f';
          break;
      case 'snow':
          body.style.backgroundColor = '#c5d9e8';
          break;
      default:
          body.style.backgroundColor = '#8ac6d1';
      case 'rain':
        body.style.backgroundColor = '#4a6572'; // Change the color to your preferred shade for rainy days
        break;
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeatherByCoords(lat, lon);
  getForecastByCoords(lat, lon);
}

function getUserLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, () => {
          getWeather('New York');
          getForecast('New York');
      });
  } else {
      alert('Geolocation is not supported by this browser.');
  }
}


document.addEventListener('DOMContentLoaded', getUserLocation);


