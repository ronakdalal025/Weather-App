const apiKey = "a30d8f8d3da3d39ccd610da60cd651ed";  // Replace with your OpenWeatherMap API key
const weatherInfo = document.getElementById('weather-info');
const weatherLocation = document.getElementById('weather-location');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const description = document.getElementById('description');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const getLocationButton = document.getElementById('get-location');


// Function to display weather data
const displayWeatherData = (data) => {
    if (data && data.sys && data.main && data.weather && data.weather[0]) {
        weatherLocation.textContent = `Location: ${data.name}, ${data.sys.country}`;
        temperature.textContent = `Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C`;  // Convert from Kelvin to Celsius
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        description.textContent = `Weather: ${data.weather[0].description}`;
    } else {
        alert('Invalid weather data received!');
    }
};


// Function to fetch weather by coordinates
const fetchWeatherByCoordinates = async (lat, lon) => {
    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === 200) {
            displayWeatherData(weatherData);  // Display weather data
        } else {
            alert('Error fetching weather data by coordinates!');
        }
    } catch (error) {
        alert('Error fetching Weather data!');
        console.error('Error:', error);
    }
};


// Function to get weather data by city name using Geocoding API
const fetchWeatherByCity = async (city) => {
    try {
        const geoResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}`);
        const geoData = await geoResponse.json();

        if (geoData.cod === 200) {
            const lat = geoData.coord.lat;
            const lon = geoData.coord.lon;
            fetchWeatherByCoordinates(lat, lon); // Fetch weather data using coordinates
        } else {
            alert('City not found!');
        }
    } catch (error) {
        alert('Error fetching Weather data!');
        console.error('Error:', error);
    }
};

// Function to get weather by geolocation
const getWeatherByGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoordinates(lat, lon);  // Fetch weather data by coordinates
        }, (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert('User denied the request for Geolocation.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert('Location information is unavailable.');
                    break;
                case error.TIMEOUT:
                    alert('The request to get user location timed out.');
                    break;
                case error.UNKNOWN_ERROR:
                    alert('An unknown error occurred.');
                    break;
            }
            console.error('Geolocation Error:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
};


// Event listeners
searchButton.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName && /^[a-zA-Z\s]+$/.test(cityName)) {
        fetchWeatherByCity(cityName);  // Fetch weather data by city name
    } else {
        alert('Please enter a city name');
    }
});

getLocationButton.addEventListener('click', getWeatherByGeolocation);  // Fetch weather by geolocation
