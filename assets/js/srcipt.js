var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=";
var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=";

var inputEl = $("#city-input");
var searchEl = $("#search-Btn");
var dayOfEl = $("#day-of");
var fiveDayEl = $("#five-day");
var prevSearchesEl = $("#past-city-search");
var cityName;
var cityLat;
var cityLon;
var previousSearches = [];
var btnHit = false;
var pastBtnEl;
var pastName;

// User enters in city name and clicks search or presses enter
// Acquire latitude and longitude data associated with that city and store

function getLatLong() {
  dayOfEl.empty();
  if (!btnHit) {
    cityName = inputEl.val();
    cityName = cityName.toUpperCase();
  } else {
    cityName = pastName;
  }
  fetch(geoURL + cityName + "&limit=1&appid=ad135c2d1b0c4e73e98dbe91d4187ad4")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    if (data.length > 0) {
        var cityNameEl = $("<h2>").text(
          cityName + " (" + moment().format("MM/DD/YY") + ")"
        );
        cityNameEl.css("display", "inline");
        dayOfEl.append(cityNameEl);
        cityLat = data[0].lat;
        cityLon = data[0].lon;
        if (!previousSearches.includes(cityName)) {
          previousSearches.push(cityName);
          localStorage.setItem(
            "previousSearches",
            JSON.stringify(previousSearches)
          );
        }
        btnHit = false;
        console.log(data);
        init();
        return getWeatherData();
      } else {
        alert("You did not enter a valid city name. Please re-enter.");
      }
    });
}
// Pass the latitude and longitude to the API fetch as parameters and acquire date, weather icon, temperature, wind, and humidity
function getWeatherData() {
  fetch(
    weatherURL +
      cityLat +
      "&lon=" +
      cityLon +
      "&appid=ad135c2d1b0c4e73e98dbe91d4187ad4"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var temp = ((9 / 5) * (data.list[0].main.temp - 273) + 32).toFixed(1);
      var wind = data.list[0].wind.speed;
      var humidity = data.list[0].main.humidity;
      var icon = data.list[0].weather[0].icon;

      var tempEl = $("<p>").text("Temp: " + temp + " F");
      var windEl = $("<p>").text("Wind: " + wind + " MPH");
      var humidityEl = $("<p>").text("Humidity: " + humidity + " %");
      var iconEl = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/w/" + icon + ".png"
      );

      dayOfEl.append(iconEl, tempEl, windEl, humidityEl);
      fiveDayEl.empty();

      // Loop through the 5 day forecast creating cards and appending to the five-day forcast section.
      for (let i = 7; i < data.list.length; i += 8) {
        temp = ((9 / 5) * (data.list[i].main.temp - 273) + 32).toFixed(1);
        var date = moment.unix(data.list[i].dt).format("MM/DD/YY");
        wind = data.list[i].wind.speed;
        humidity = data.list[i].main.humidity;
        icon = data.list[i].weather[0].icon;

        var cardEl = $("<div>").attr("class", "card col-lg-2 col-sm-12 m-3");
        var cardBodyEl = $("<div>").attr("class", "card-body");
        var newDateEl = $("<h5>").text(date);
        var newIconEl = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/w/" + icon + ".png"
        );
        var newTempEl = $("<p>").text("Temp: " + temp + " F");
        var newWindEl = $("<p>").text("Wind: " + wind + " MPH");
        var newHumidityEl = $("<p>").text("Humidity: " + humidity + " %");

        cardEl.css(
          "background",
          "linear-gradient(90deg, rgb(135, 178, 235), rgb(27, 27, 180))"
        );
        cardBodyEl.css("color", "white");
        cardBodyEl.css("padding", "0");
        cardBodyEl.append(
          newDateEl,
          newIconEl,
          newTempEl,
          newWindEl,
          newHumidityEl
        );
        cardEl.append(cardBodyEl);
        fiveDayEl.append(cardEl);
      }
    });
}

function init() {
  // check for previously stored searches if not null then update storage array.
  // Create a button with the name of the city and append to the past city search section.
  prevSearchesEl.empty();
  if (localStorage.getItem("previousSearches") !== null) {
    previousSearches = JSON.parse(localStorage.getItem("previousSearches"));
    for (let i = 0; i < previousSearches.length; i++) {
      var newBtn = $("<button>").text(previousSearches[i]);
      newBtn.attr("class", "btn btn-secondary mb-2 text-center col-lg-12");
      prevSearchesEl.append(newBtn);
    }
  }
}

function loadPastCity(event) {
  if (event.target.tagName === "BUTTON") {
    pastBtnEl = event.target;
    pastName = pastBtnEl.innerHTML;
    btnHit = true;
    getLatLong();
  }
}

init();
searchEl.on("click", getLatLong);
prevSearchesEl.on("click", loadPastCity);
