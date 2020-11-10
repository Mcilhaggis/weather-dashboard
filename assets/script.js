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


    getAPI(cityName);
    getFiveDayAPI(cityName);

}); 

//Getting the one-day forecast for searched city 
function getAPI(city){
var weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=6b0d5c546226a11c17010c1077322954'

fetch(weatherAPI)
.then(function(response){
    return response.json();
})
.then((data) => {
            mainCity.innerText = data.name + ' ' + today + ' '
            $(".current-icon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png");
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
            //Apply UV rating to page adn setting colour of box
            .then((data) => {
                uvBox.innerText = data.value;
                var uvValue = parseInt(uvBox.innerText);
                if(uvValue < 2){
                    $(".uv-box").addClass("uv-low");
                } else if (uvValue > 2 && uvValue < 5){
                    $(".uv-box").addClass("uv-moderate");
                } else if (uvValue >= 6 && uvValue <=7){
                    $(".uv-box").addClass("uv-high");
                }else if (uvValue >= 8 && uvValue <=15){
                    $(".uv-box").addClass("uv-very-high");
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    });

}
 

//Getting the 5-day forecast for the immediately searched city 
function getFiveDayAPI(city){
    var weatherFiveDayAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=imperial&appid=6b0d5c546226a11c17010c1077322954';
    
    fetch(weatherFiveDayAPI)
    .then(function(response){
        return response.json();
        
    })
    .then((data) => {
        var results = data.list;

        //5-day card variables 
var fiveDayCards = document.querySelectorAll(".five-card");

var cardIndex = 0;
$(".date-five").empty();
        //adding dates to each of the cards from today's day onwards 
        for (i = 0; i < results.length; i+= 8){
                var currentCard = fiveDayCards[cardIndex];
                //Set the date
                var currentDayDate = currentCard.querySelector(".date-five");
                currentDayDate.innerText = m.add(1, 'day').format("l");
                //Set the icon
                var currentDayIcon = currentCard.querySelector(".five-icon");
                var weatherIcon = data.list[i].weather[0].icon;
                currentDayIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherIcon + ".png")
                //Set the Temp   
                var currentDayTemp = currentCard.querySelector(".temp-five");
                currentDayTemp.innerText = 'Temp: ' + data.list[i].main.temp + ' °F';
                //Set the humidity
                var currentDayHumidity = currentCard.querySelector(".humid-five");
                currentDayHumidity.innerText = 'Humidity: ' + data.list[i].main.humidity + '%';
                cardIndex++;
            }
        
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}

    
//Create Function for Saving user input from search bar

$('#save-search').on('click', function(){
    $('input[type="text"]').each(function(){        
        var searchedCity = $(this).val();
        if(searchedCity === ""){
        console.log("invalid input");
        return;
        }
        var previouslySearchedArr = JSON.parse(localStorage.getItem("citiesArr")) || [];
        previouslySearchedArr.push(searchedCity);
        localStorage.setItem("citiesArr", JSON.stringify(previouslySearchedArr));
        searchButtons();


        getAPI(searchedCity);
        getFiveDayAPI(searchedCity);
    });
});



// //Function for creating the buttons 
function searchButtons() {
    //check local storage to check for key (past searches)
    var buttonValueArray = JSON.parse(localStorage.getItem("citiesArr"));
    console.log(buttonValueArray);
    //loop over the values in the array (the city names)
    $(".previouslySearched").empty();
    for (i= 0; i < buttonValueArray.length; i++){
        $(".previouslySearched").append($("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded search-history' style='width: 100%;'>").text(buttonValueArray[i]));
    }


        $(".search-history").click(function(e){
            e.preventDefault();
            var value = ($(this).text());
            console.log(value);
            getAPI(value);
            getFiveDayAPI(value);
        });
    
    }
   
