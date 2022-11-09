// Global Variables
var units = "units=imperial";
var APIKey = "appid=26ba3a7e283acb9cd1e8665c6c3b319a";
var dailyWeather = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastWeather ="https://api.openweathermap.org/data/2.5/forecast?";
var weatherIcon = "http://openweathermap.org/img/wn/";

// Element Variables
var citySearchForm = $("#citySearchForm");
var searchedCities = $("#searchedCityLi");
var searchCity = "";

// get todays weather
var getWeather = function () {
    event.preventDefault();
    var dailyWeatherApiUrl = dailyWeather + searchCity + "&" + APIKey + "&" + units;
    fetch(dailyWeatherApiUrl).then(function (response) {
        if (response.ok) {
        return response.json().then(function (response) {
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;
            getForecast(latitude, longitude);
            $("#cityName").html(response.name);
            var date = moment.unix(response.dt).format("MM/DD/YY");
            $("#currentDate").html(date);
            var weatherIcon = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            $("#weatherIcon").attr("src", weatherIcon);
            $("#temp").html(response.main.temp + "\u00B0F");
            $("#wind").html(response.wind.speed + "MPH");
            $("#humidity").html(response.main.humidity + "%");            
    });
    }else {
        alert("Enter a city name");    
    }
});
};

// get 5 day forecast
var getForecast = function (latitude, longitude) {
  var weeklyWeatherApiUrl = forecastWeather + 'lat=' + latitude + "&lon=" + longitude + "&" + APIKey + "&" + units;
    fetch(weeklyWeatherApiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        for(var i = 0; i < 33; i+=8) {
        var getDate1 = response.list[i].dt;
        var date1 = moment.unix(getDate1).format("MM/DD/YYYY");
        var getTemp1 = response.list[i].main.temp;
        var getWind1 = response.list[i].wind.speed;  
        var getHumidity1 = response.list[i].main.humidity;
        var weatherIcon1 = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
        $("#date" + [i]).html(date1);
        $("#temp" + [i]).html(getTemp1 + "\u00B0F");
        $("#wind" + [i]).html(getWind1 + "MPH");
        $("#humidity" + [i]).html(getHumidity1 + "%");        
        $("#weatherIcon" + [i]).attr("src", weatherIcon1);
}});
  };
// storing search history and creating button to re-search
var searchHistoryList = document.querySelector("#searchedCityLi");

var searchHistory = [];

function renderHistory() {

  searchHistoryList.innerHTML = "";

  for (var i = 0; i < searchHistory.length; i++) {
    var history = searchHistory[i];

    var li = document.createElement("li");
    li.setAttribute("data-index", i);

    var button = document.createElement("button");
    button.textContent = history;

    li.appendChild(button);
    searchHistoryList.appendChild(li);
  }
}

function init() {
  var storedHistory = JSON.parse(localStorage.getItem("searchHistory"));
  if (storedHistory !== null) {
    searchHistory = storedHistory;
  }
  renderHistory();
}

function storeHistory() {
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

searchHistoryList.addEventListener("click", function(event) {
  var element = event.target;
  if (element.matches("button") === true) {
    var index = element.parentElement.getAttribute("data-index");
    searchCity = searchHistory[index];
    getWeather();
    storeHistory();
    renderHistory();
  }
});

init();

// search button
$(citySearchForm).on("submit", function (event) {
  event.preventDefault();
   searchCity = $("#searchCity").val().trim();
    getWeather();
    if (searchHistory.length > 9) {
      searchHistory.pop();
    }

    if (searchCity === "" || searchHistory.includes(searchCity)) {
    return;
  } else {

  searchHistory.unshift(searchCity);
  searchCity = "";
    storeHistory();
    renderHistory();
  }
  });