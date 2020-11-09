
//Global variables
var cityName;
var mainCity = document.querySelector(".city-name");
var currentIcon = document.querySelector(".current-icon");
var mainTemp = document.querySelector(".temperature");
var mainHumidity = document.querySelector(".humidity");
var mainWindSpeed = document.querySelector(".wind-speed");
var mainUvIndex = document.querySelector(".uv-index");
var uvBox = document.querySelector(".uv-box");

//Time Variables
var today = moment().format("l");
var m = moment();

//Getting the users city input value
$('.btn').click(function(e){
    e.preventDefault();
    cityName = document.getElementById('search').value;
    //applying the input to the getAPI function
    getAPI(cityName);
    getFiveDayAPI(cityName);

    //add function here for adding to previously searched list and maybe a second one for storing the data 


}); 

//Getting the one-day forecast for searched city 
function getAPI(city){
var weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=6b0d5c546226a11c17010c1077322954'

fetch(weatherAPI)
.then(function(response){
    return response.json();
})
.then((data) => {
    console.log(data);
    //icon link needs fixed
            mainCity.innerText = data.name + ' ' + today + ' ' + data.weather[0].icon;
            mainTemp.innerText = 'Temperature: ' + data.main.temp +'°F';
            mainHumidity.innerText = 'Humidity: ' + data.main.humidity +'%';
            mainWindSpeed.innerText = 'Wind Speed: ' + data.wind.speed + 'MPH';
//Storing the lat long values to use in seperate API calls for the UV index
            var lat = data.coord.lat;
            var lon = data.coord.lon;
//Get the UV rating for that city
            var uvAPI = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=6b0d5c546226a11c17010c1077322954';

            fetch(uvAPI)
            .then(function(response){
                return response.json();
            })
            //Apply UV rating to page
            .then((data) => {
                uvBox.innerText = data.value;
            })
    });

}
 
//Set the colour of the UV box
// needs to be fixed to chagne to higher uv rates


if(uvBox.innerText <= 2){
    $(".uv-box").addClass("uv-low");
} else if (uvBox.innerText >= 3 && uvBox.innerText <= 5){
    $(".uv-box").addClass("uv-moderate");
} else if (uvBox.innerText >= 6 && uvBox.innerText <=7){
    $(".uv-box").addClass("uv-high");
}else if (uvBox.innerText >= 8 && uvBox.innerText <=10){
    $(".uv-box").addClass("uv-very-high");
}


//Create 5-day cards dynamically and loop through whilst adding the info from the API per day

//Getting the 5-day forecast for the immediately searched city 
//Applying to one card first then will figure out loop
function getFiveDayAPI(city){
    console.log(city);
    var weatherFiveDayAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=6b0d5c546226a11c17010c1077322954';
    
    fetch(weatherFiveDayAPI)
    .then(function(response){
        console.log(response);
        return response.json();
        
    })
    .then((data) => {
        console.log(data);
        var results = data.list;

        //5-day card variables 
var fiveDayCards = document.querySelectorAll(".five-card");
var fiveDayIcon = document.querySelectorAll(".five-icon");
var fiveDayDate = document.querySelector(".date-five");
var fiveDayTemp = document.querySelector(".temp-five");
var fiveDayHumidity = document.querySelector(".humid-one");

        //adding dates to each of the cards from today's day onwards 
        for (i = 0; i < results.length; i+= 8){

                //adding date to five day forecast
                fiveDayDate.innerText = m.add(1, 'day').format("l");

                //adding weather icon to five day forecast
                var weatherIcon = data.list[i].weather[0].icon;
                console.log(weatherIcon);
                $(".five-icon").attr("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png");

                //add the temp to the cards
                fiveDayTemp.innerText = 'Temp: ' + data.list[i].main.temp + ' °F';
                console.log(fiveDayTemp.innerText);

                //adding humidity to each card
                fiveDayHumidity.innerText = 'Humidity: ' + data.list[i].main.humidity + '%';
                console.log(fiveDayHumidity.innerText);

            }
                })

                }

    
//Create Function for Saving user input from search bar

$('#save-search').on('click', function(){
    $('input[type="text"]').each(function(){
        var searchedCity = $(this).val();
        //probably want to store the details as an array for resuse
        var weatherDetails = $(this).siblings("input").val();
        var storedArr= [];
        storedArr.push(weatherDetails);
        localStorage.setItem(searchedCity, JSON.stringify(storedArr));


//add splice() to limit the number of search results shown 
        // getAPI(searchedCity);
        // getFiveDayAPI(searchedCity);
    });
});

//append the city name to the list under the seach bar

//Calls stored items on page load
function pageLoad () {
    var lastSearch = JSON.parse(localStorage.getItem('searchedCity'));
    var searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded search-history' style='width: 12rem;'>").text(lastSearch);
    var psearch = $(".previouslySearched");
    psearch.append(searchDiv)
    $("#search-history").prepend(psearch);
}

pageLoad();

//Event deligation...
$("#search-history").on('click', '.btn', function(event) {
event.preventDefault();
    console.log($(this).text());
    searchedCity($(this).text());

});