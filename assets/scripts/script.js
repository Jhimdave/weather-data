const weather_apikey = "600edf1cc91e71a17f037e3747a98f45";
const CITY_NAME = document.getElementById("city-input");
const CITY_SEARCH = document.getElementById("find-location");
const USER_LOCATION = document.getElementById("get-location");
const container = document.querySelector(".container");

// Output Weather Elements
const WEATHER_DATA = document.querySelector(".weather-data");
const TEMPERATURE = document.querySelector(".temperature");
const weatherIcon = WEATHER_DATA.querySelector("img");
const temperature = WEATHER_DATA.querySelector(".temp");
const description = WEATHER_DATA.querySelector(".description");
const locate = document.getElementById("location-text");
const temp = TEMPERATURE.querySelector(".feels-like");
const humid = TEMPERATURE.querySelector(".humid");
const wind_speed = TEMPERATURE.querySelector(".wind-speed");
const errorMessage = document.getElementById("error-message");

// Event listener for city search on Enter key press
CITY_NAME.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && CITY_NAME.value.trim() !== "") {
    const cityValue = CITY_NAME.value.trim();
    console.log(cityValue);
    getWeatherData(cityValue);
    CITY_NAME.value = "";
  }
});

// Event listener for city search button click
CITY_SEARCH.addEventListener("click", (e) => {
  e.preventDefault();
  const cityValue = CITY_NAME.value.trim();
  console.log(cityValue);
  getWeatherData(cityValue);
  CITY_NAME.value = "";
});

// Event listener for "Get Location" button click
USER_LOCATION.addEventListener("click", (e) => {
  e.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation API");
  }
  CITY_NAME.value = "";
});

// Function to handle successful retrieval of current position
function onSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log("Latitude:", latitude, "Longitude:", longitude);

  // Use reverse geocoding to get city name based on coordinates
  getCityName(latitude, longitude);
}

// Function to handle errors in geolocation retrieval
function onError(error) {
  console.error("Error getting geolocation:", error.message);
  showErrorMessage("Error getting geolocation. Please try again.");
}

// Function to fetch city name based on coordinates
async function getCityName(latitude, longitude) {
  container.style.height = "auto";
  CITY_NAME.style.marginTop = "0";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weather_apikey}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const weatherData = await response.json();
    const city = weatherData.name;
    const country = weatherData.sys.country;
    const cityValue = `${city}, ${country}`;

    getWeatherData(cityValue);
  } catch (error) {
    CITY_NAME.style.marginTop = "200px";
    console.error("Error fetching city name:", error);
    showErrorMessage("Error fetching location data. Please try again.");
  }
}

// Function to fetch weather data based on city name
async function getWeatherData(cityValue) {
  container.style.height = "auto";

  try {
    const weatherResult = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&units=metric&appid=${weather_apikey}`
    );

    if (!weatherResult.ok) {
      throw new Error("Network response was not ok");
    }

    const weatherData = await weatherResult.json();

    const getTemperature = Math.round(weatherData.main.temp);
    const getDescription = weatherData.weather[0].description;
    const getIcon = generateIcon(weatherData.weather[0].id);
    const getLocation = weatherData.name + ", " + weatherData.sys.country;
    const getFeelsLike = Math.round(weatherData.main.feels_like);
    const getHumidity = weatherData.main.humidity;
    const getWindspeed = weatherData.wind.speed;

    weatherIcon.src = getIcon;
    temperature.textContent = `${getTemperature}°C`;
    description.textContent = getDescription;
    locate.textContent = getLocation;
    temp.textContent = `${getFeelsLike}°C`;
    humid.textContent = `${getHumidity}%`;
    wind_speed.textContent = `${getWindspeed}m/s`;

    console.log(weatherData);

    // Hide error message if data is fetched successfully
    errorMessage.style.display = "none";

    WEATHER_DATA.classList.remove("hidden");
    TEMPERATURE.classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showErrorMessage("Error fetching weather data. Please try again.");
  }
}

// Function to show error messages
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";

  // Hide weather data
  WEATHER_DATA.classList.add("hidden");
  TEMPERATURE.classList.add("hidden");
}

// Function to generate weather icon path based on weather ID
function generateIcon(id) {
  let iconPath = "";

  if (id == 800) {
    iconPath = "assets/icons/clear.svg";
  } else if (id >= 200 && id <= 232) {
    iconPath = "assets/icons/storm.svg";
  } else if (id >= 600 && id <= 622) {
    iconPath = "assets/icons/snow.svg";
  } else if (id >= 701 && id <= 781) {
    iconPath = "assets/icons/haze.svg";
  } else if (id >= 801 && id <= 804) {
    iconPath = "assets/icons/cloud.svg";
  } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
    iconPath = "assets/icons/rain.svg";
  }

  return iconPath;
}
