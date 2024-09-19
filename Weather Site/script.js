const searchWeatherTab=document.querySelector('[search-weather-tab]');
const userWeatherTab=document.querySelector('[user-weather-tab]');

const grantLocation=document.querySelector(".grant-location-container");
const searchContainer=document.querySelector(".search-container");
const loadingContainer=document.querySelector(".loading-screen-container");
const userWeatherDisplay=document.querySelector(".weather-display-container");
const notfoundcontainer=document.querySelector("[not-found]");



const city=document.querySelector("[city-name]");
const flag=document.querySelector("[country-flag]");
const weather_desc=document.querySelector("[weather-desc]");
const weather_icon=document.querySelector("[weather-icon]");
const temp=document.querySelector("[temperature]");
const wind_speed=document.querySelector("[wind-speed]");
const humidity=document.querySelector("[humidity]");
const clouds=document.querySelector("[cloudiness]");

async function trials(){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=d1845658f92b31c64bd94f06f7188c9c&units=metric`);

        const data=await response.json();
        renderUserInfo(data);
        console.log("hogya");
    }
    catch{
        console.log("nahi ho paya");
    }
}

const API="d1845658f92b31c64bd94f06f7188c9c";
let currenttab=userWeatherTab;

currenttab.classList.add('current-tab');

searchWeatherTab.addEventListener('click',function(){
    switchtab(searchWeatherTab);
});
userWeatherTab.addEventListener('click',function(){
    switchtab(userWeatherTab);
});
function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

async function renderUserInfo(data){
    console.log(data);
    city.innerText=data['name'];
    const country_code=data['sys']['country'];
    const url= await `https://flagsapi.com/${country_code}/shiny/32.png`;
    flag.src=url;
    weather_desc.innerText=toTitleCase(data['weather'][0]['description']);
    const iconcode=data['weather'][0]['icon'];
    weather_icon.src=`https://openweathermap.org/img/w/${iconcode}.png`;
    temp.innerText=`${data['main']['temp']}°C`;
    wind_speed.innerText=`${data['wind']['speed']}m/s`;
    humidity.innerText=`${data['main']['humidity']}%`;
    clouds.innerText=`${data['clouds']['all']}%`;
}

async function fetchUserWeatherInfo(coord){
    const {lat,lon}=coord;

    grantLocation.classList.remove("active");
    loadingContainer.classList.add('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);

        const data=await response.json();

        loadingContainer.classList.remove("active");
        userWeatherDisplay.classList.add('active');
        renderUserInfo(data);
    }
    catch{
        loadingContainer.classList.remove('active');
        const element=document.createElement('p');
        element.innerText="TECHNICAL ERROR ! PLEASE TRY AGAIN LATER";
        document.body.appendChild(element);
    }
}

getfromSessionStorage();//calling for the direct opening

function getfromSessionStorage(){
    let coordinates=sessionStorage.getItem("lat_lon");
    if(!coordinates){
        //nhi mile 
        grantLocation.classList.add("active");
    }
    else{
        const coord=JSON.parse(coordinates);
        fetchUserWeatherInfo(coord);//mtlb coordinates h toh api call  krke nikalle info
    }
}

function switchtab(clickedtab){
    console.log("called");
    if(currenttab!=clickedtab){
        currenttab.classList.remove('current-tab');//dehighlighting the prv tab
        currenttab=clickedtab;
        currenttab.classList.add('current-tab');//highlighting the current tab

        if(!searchContainer.classList.contains('active')){
            //mtlb pehle user weathr p the ab search weather p aye h
            
            grantLocation.classList.remove('active');
            userWeatherDisplay.classList.remove('active');
            searchContainer.classList.add('active');
        }
        else{
            //mtlb ab user weather p aaye h 
            searchContainer.classList.remove('active');
            notfoundcontainer.classList.remove("active");
            userWeatherDisplay.classList.remove('active');
            getfromSessionStorage();//ab hm user weather p jare h agar location h hmpe toh wahi use kr lenge nhi toh mangni hogi 
        }

        
    }
}

function getlocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    const userCoords={
        lat: position.coords.latitude,
        lon:  position.coords.longitude,
    }
    sessionStorage.setItem("lat_lon",JSON.stringify(userCoords));
    fetchUserWeatherInfo(userCoords);

}

const grantaccessbutton=document.querySelector('[grant-access-button]');
grantaccessbutton.addEventListener('click',getlocation);


async function fetchSearchWeatherInfo(city){
    notfoundcontainer.classList.remove("active");
    loadingContainer.classList.add('active');
    userWeatherDisplay.classList.remove('active');
    console.log("here");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
        const data=await response.json();

        loadingContainer.classList.remove("active");
        if(data['message']==='city not found'){
            notfoundcontainer.classList.add("active");
        }
        else{
            userWeatherDisplay.classList.add('active');
            renderUserInfo(data);
        }
    }
    catch(error){
        console.log("error",error);
        loadingContainer.classList.remove('active');
        const element=document.createElement('p');
        element.innerText="TECHNICAL ERROR ! PLEASE TRY AGAIN LATER";
        document.body.appendChild(element);
    }
}
const searched_city=document.querySelector('[search-city]');

const searchbutton=document.querySelector('[search-form]');

searchbutton.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityname=searched_city.value;
    if(cityname==="")    return;
    else    fetchSearchWeatherInfo(cityname);
});

