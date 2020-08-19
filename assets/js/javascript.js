var apiKey = "&appid=5e7b224c91d9b5f0ca260c0e0222df35"
var queryCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" // need a user input var
var queryUVIndex = "http://api.openweathermap.org/data/2.5/uvi/forecast?q=" //appid={appid}&lat={lat}&lon={lon}&cnt={cnt}" //http://api.openweathermap.org/data/2.5/uvi/forecast?appid={appid}&lat={lat}&lon={lon}&cnt={cnt} will edit as we go
var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" // need city input and api key
var userInput = []
//click function to grab userinput from the input field

//click function to search the "history/stored" city from localstorage

//create a function that will make a new row/item in your listed cities
function storeCities(){
    localStorage.setItem("cities", JSON.stringify(userInput));
}

function createUserInput(){
    $(".cityList").empty();
    userInput.forEach(function(city){
        $(".cityList").prepend($(`<button class="list-group-item list-group-item-action cityButton" data-city="${city}">${city}</button>`));
    })
}

function init(){
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (storedCities ==! null) {
        userInput = storedCities;
    }

    createUserInput();

    if (userInput){
        var thisCity = userInput[userInput.length - 1]
        getWeather(thisCity);
        getForecast(thisCity);
    }
}

function getWeather(userInput){
    $.ajax({
        url: queryCurrentWeather + userInput + apiKey,
        method: "GET"
        })
        .then(function(response) {
            console.log(response)
            console.log(response.main)
            $(".cityToday").append(
                `<div class="row m1-1">
                    <h3 class="mr-3">${response.name} (${(new Date(1000 * response.dt).getUTCMonth()) + 1}/${(new Date(1000 * response.dt).getUTCDate()) - 1}/${new Date(1000 * response.dt).getUTCFullYear()})</h3>
                    <img src="http://openweathermap.org/img/w/${response.weather[0].icon}.png">
                </div>`
            )
            $(".cityToday").append(`<p>Temperature: ${response.main.temp} &degF</p>`)
            $(".cityToday").append(`<p>Humidity: ${response.main.humidity} %</p>`)
            $(".cityToday").append(`<p>Wind: ${response.wind.speed} mph</p>`)
            Lat = response.coord.lat;
            Lon = response.coord.lon;
            // uncomment when function is created - getUVIndex(id, cityLat, cityLong);
            //manipulate the html elements of current weather data with the newly grabbed data from api

            //adding the elements to page

            //execute the getForcast fucntion
            getForecast(userInput)
            //execute the UVIndex function
            getUVIndex(response.coord.lat, response.coord.lon)
        });
};

function getForecast(userInput){
    $.ajax({
        url: queryForecast + userInput + apiKey,
        method: "Get"
    })
    .then(function(response) {
        for (i = 0; i < response.list.length; i++){
            if (response.list[i].dt_txt.search("15:00:00") != -1) {
                var forecastDate = response.list[i];
                $(".forecast").append(
                    `<div class="card bg-primary shadow m-4">
                        <div class="card-body">
                            <h4 class="card-title">${(new Date(1000 * forecastDate.dt).getUTCMonth()) + 1}/${new Date(1000 * forecastDate.dt).getUTCDate()}/${new Date(1000 * forecastDate.dt).getUTCFullYear()}</h4>
                            <div class="card-text">
                                <img src="http://openweathermap.org/img/w/${forecastDate.weather[0].icon}.png">
                                <p class="card-text">Temp: ${forecastDate.main.temp} &degF</p>
                                <p class="card-text">Humidity: ${forecastDate.main.humidity} %</p>
                            </div>
                        </div>
                    </div>`
                );
            }
        }
    })
}

function getUVIndex(lat, lon){
    $.ajax({
        url: queryUVIndex + apiKey + "&lat=" + lat + "&lon=" + lon,
        method: "GET"
    })
    .then(function(response) {
        console.log(response)
    })

}

function displayCityWeather(){
    var thisCity = $(this).attr("data-city");

    $(".cityToday").empty();
    getWeather(thisCity);

    $(".cityToday").empty();
    getForecast(thisCity);
}

init();

$("form").on("submit", function(event){
    event.preventDefault();
    console.log("what's this button do?")
    var newCity = $("#citySearchInput").val().trim();
    userInput.push(newCity);
    createUserInput();
    storeCities();
    $("#citySearchInput").val("");
})

$(".cityList").on("click", ".cityButton", displayCityWeather);
getWeather("lubbock");
getUVIndex("lubbock");
