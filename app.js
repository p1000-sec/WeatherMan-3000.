const apiKey = '56d90c55478f56ba65fd49ba382c553f';  // Your OpenWeatherMap API key
let cities = [];  // Array to store cities

// Function to fetch the current weather
function fetchWeather() {
    const city = document.getElementById('city').value;
    if (!city) return alert('Please enter a city name.');

    cities.push(city);
    updateCitySelector();

    // Current Weather API Call
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayCurrentWeather(data);
                setWeatherBackground(data.weather[0].main);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching weather:', error));
}

// Function to update the city selector dropdown with previously entered cities
function updateCitySelector() {
    const selector = document.getElementById('city-selector');
    selector.innerHTML = `<option value="">Previous Cities</option>` +
                         cities.map(city => `<option value="${city}">${city}</option>`).join('');
}

// Function to switch to a previously selected city from the dropdown
function switchCity() {
    const selectedCity = document.getElementById('city-selector').value;
    if (selectedCity) {
        document.getElementById('city').value = selectedCity;
        fetchWeather();
    }
}

// Function to set the background class based on the weather type
function setWeatherBackground(weatherType) {
    const weatherApp = document.getElementById('weatherApp');
    weatherApp.className = "weather-app"; // Reset class to default

    // Add appropriate background class based on weather conditions
    if (weatherType.toLowerCase().includes("cloud")) {
        weatherApp.classList.add("cloudy");
    } else if (weatherType.toLowerCase().includes("rain")) {
        weatherApp.classList.add("rainy");
    } else if (weatherType.toLowerCase().includes("snow")) {
        weatherApp.classList.add("snowy");
    } else {
        weatherApp.classList.add("sunny");
    }
}

// Function to fetch the forecast for the selected city
function fetchForecast(days) {
    const city = document.getElementById('city').value;
    if (!city) return alert('Please enter a city name.');

    // Forecast API Call
    const forecastAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(forecastAPI)
        .then(response => response.json())
        .then(data => displayForecast(data, days))
        .catch(error => console.error('Error fetching forecast:', error));
}

// Function to display the current weather information
function displayCurrentWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}

// Function to display the weather forecast for the next few days
function displayForecast(data, days) {
    const forecastDisplay = document.getElementById('forecast-display');
    const filteredData = data.list.filter((_, index) => index % 8 === 0); // Roughly once per day

    forecastDisplay.innerHTML = filteredData.slice(0, days).map(day => `
        <div class="forecast-card">
            <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
            <p>${day.main.temp}°C</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon">
            <p>${day.weather[0].description}</p>
        </div>
    `).join('');
}
