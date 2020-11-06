
//Global variables
var cityName;
var mainCity = document.querySelector(".city-name");
var mainTemp = document.querySelector(".temperature")
var mainHumidity = document.querySelector(".humidity");
var mainWindSpeed = document.querySelector(".wind-speed");
var mainUvIndex = document.querySelector(".uv-index");
var uvBox = document.querySelector(".uv-box");
//5-day Card Global Variables 
var fiveDayDate = document.querySelector(".date-one");
var fiveDayTemp = document.querySelector(".temp-one");
var fiveDayHumidity = document.querySelector(".humid-one");
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

}); 

//Getting the one-day forecast for searched city 
function getAPI(city){
var weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=6b0d5c546226a11c17010c1077322954'

fetch(weatherAPI)
.then(function(response){
    return response.json();
})
.then((data) => {
            mainCity.innerText = data.name + ' ' + today;
            mainTemp.innerText = 'Temperature: ' + data.main.temp +'°F';
            mainHumidity.innerText = 'Humidity: ' + data.main.humidity +'%';
            mainWindSpeed.innerText = 'Wind Speed: ' + data.wind.speed + 'MPH';
//Storing the lat long values to use in seperate API calls for the UV index
            var lat = data.coord.lat;
            var lon = data.coord.lon;
//Get the UV rating for that city
            var uvAPI = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=6b0d5c546226a11c17010c1077322954';
            console.log(uvAPI);

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
    $(".uv-box").addClass("uv-moderate");
}else if (uvBox.innerText >= 8 && uvBox.innerText <=10){
    $(".uv-box").addClass("uv-moderate");
}


//Create 5-day cards dynamically and loop through whilst adding the info from the API per day

//Getting the 5-day forecast for the immediately searched city 
//Applying to one card first then will figure out loop
function getFiveDayAPI(city){
    console.log(city);
    var weatherFiveDayAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=6b0d5c546226a11c17010c1077322954';
    
    fetch(weatherFiveDayAPI)
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then((data) => {
        console.log(data);
                fiveDayDate.innerText = m.add(1, 'day').format("l");
                console.log(fiveDayDate.innerText);
                //It return a log of everything every three hours, how do we select one?
                //This code is not correct
               for (var i = 0; i < data.list.length; i++){
                   if(fiveDayDate.innerText == data.list[i].dt_txt){
                       console.log(data.list[i].main.temp);
                   }
                }
         });
    }
     