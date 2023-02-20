const apiKey = 'c07aa11fc02e55dff21a6c7b5de6760e';
let search = '';
const cityName = document.querySelector('#city-name');
const temperature = document.querySelector('#temperature');
const feelsLike = document.querySelector('#feels-like');
const windSpeed = document.querySelector('#wind-speed');
const cityInput = document.querySelector('#city-input');
const cityForm = document.querySelector('#city-form');
const weatherIcon = document.querySelector('#weather-icon');
const errorMessage = document.querySelector('#error-message');
const forecastTemp = document.querySelectorAll('.forecast-temp');
const forecastIcon = document.querySelectorAll('.forecast-icon');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const forecastDays = document.querySelectorAll('.forecast-day h2');
const humidity = document.querySelector('#humidity');


cityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    search = cityInput.value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            cityName.innerText = data.name;
            temperature.innerText = ((data.main.temp - 273.15) * 9/5 + 32).toFixed(2) + ' °F';
            feelsLike.innerText = ((data.main.feels_like - 273.15) * 9/5 + 32).toFixed(2) + ' °F';
            windSpeed.innerText = data.wind.speed;
            humidity.innerText = data.main.humidity;
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            errorMessage.style.display = 'none';
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${apiKey}`)
                .then(res => res.json())
                .then(data => {
                    for (let i = 0; i < 3; i++) {
                        const dt = data.list[i*8].dt; 
                        const date = new Date(dt * 1000);
                        const dayName = days[date.getUTCDay()];
                        forecastDays[i].innerText = dayName;
                        forecastTemp[i].innerText = ((data.list[i*8].main.temp - 273.15) * 9/5 + 32).toFixed(2) + ' °F';
                        forecastIcon[i].setAttribute('src', `http://openweathermap.org/img/wn/${data.list[i*8].weather[0].icon}@2x.png`);
                    }
                    
                        })
                        .catch(err => {
                        errorMessage.style.display = 'block';
                        errorMessage.innerText = err;
                        });
                        })
                        .catch(err => {
                        errorMessage.style.display = 'block';
                        errorMessage.innerText = err;
                        });
                        });


// Function to make current location the default

function showCurrentWeather() {
    removeWeatherClass()
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                .then(res => res.json())
                .then(data => {
                    cityName.innerText = data.name;
                    temperature.innerText = ((data.main.temp - 273.15) * 9/5 + 32).toFixed(2) + ' °F';
                    feelsLike.innerText = ((data.main.feels_like - 273.15) * 9/5 + 32).toFixed(2) + ' °F';
                    windSpeed.innerText = data.wind.speed;
                    humidity.innerText = data.main.humidity;
                    weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                    errorMessage.style.display = 'none';

                    //Fetch 3 day forecast
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                        .then(res => res.json())
                        .then(data => {
                            for (let i = 0; i < 3; i++) {
                                const dt = data.list[i*8].dt; 
                                const date = new Date(dt * 1000);
                                const dayName = days[date.getUTCDay()];
                                forecastDays[i].innerText = dayName;
                                forecastTemp[i].innerText = ((data.list[i*8].main.temp - 273.15) * 9/5 + 32).toFixed(2) + ' °F';
                                forecastIcon[i].setAttribute('src', `http://openweathermap.org/img/wn/${data.list[i*8].weather[0].icon}@2x.png`);
                            }
                        })
                        .catch(err => {
                            errorMessage.style.display = 'block';
                            errorMessage.innerText = err;
                        });
                })
                .catch(err => {
                    errorMessage.style.display = 'block';
                    errorMessage.innerText = err;
                });
        });
    } else {
        errorMessage.style.display = 'block';
        errorMessage.innerText = 'Geolocation is not supported by this browser.';
    }

}

window.onload = function() {
    showCurrentWeather();
  };



  //   Change Color Scheme

function changeColorScheme(){
    if (data.weather[0].main === "Clear") {
        document.body.classList.add("sunny");
    } else if (data.weather[0].main === "Clouds") {
        document.body.classList.add("cloudy");
    } else if (data.weather[0].main === "Rain") {
        document.body.classList.add("rainy");
    }    
}

function removeWeatherClass() {
    document.body.classList.remove("sunny", "cloudy", "rainy");
}