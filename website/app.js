// Personal API Key for OpenWeatherMap API
const apiKey = "ba77344acbfcf271f95c93bda5eae2be";

//Get Today Date
const now = new Date();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const today = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

// Event listener to add function to existing HTML DOM element

/* Event Listener for generate button */
document.querySelector("#generate").addEventListener("click", () => {
    const zipcode = document.querySelector("#zip").value;
    const feelings = document.querySelector("#feelings").value;
    if(zipcode){
        getAPIData(zipcode)
        .then(data => {
            postData("/weather", {
                place: data.name,
                country: data.sys.country,
                img: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                windspeed: `${data.wind.speed} mi/h`, 
                maxTemp: `${Math.round(data.main.temp_max)} °F`,
                minTemp: `${Math.round(data.main.temp_min)} °F`,
                humidity: `${Math.round(data.main.humidity)} %`,
                temp: `${Math.round(data.main.temp)} °F`,
                cloudPer: `${data.clouds.all} %`,
                cloudiness: data.weather[0].description,
                sunrise: formatUnixTime(data.sys.sunrise),
                sunset: formatUnixTime(data.sys.sunset),
                date: today,
                userResponse: feelings ? feelings : ""
            })
        })
        .then(data => {
            getProjectData ("/all");
        })
    }
});

/* Format Sunset and Sunrise Time */
const formatUnixTime = (unixTime) => {
    const time = new Date(unixTime * 1000);
    return `${time.toUTCString().slice(17, 25)} GMT`;
}

/* Function to GET Web API Data*/
const getAPIData =  async (zipcode) => {
    const request = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=imperial&appid=${apiKey}`)
    try {
        const allData = await request.json();
        return allData;
    } catch (e){
        console.log("Error", e);
    }
}

/* Function to POST data */
const postData = async (url = "", data = {temp,date,userResponse}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try{
        const newData = await response.json();
        return newData;

    } catch (e) {
        console.log("Error", e);
    }
}

/* Function to GET Project Data */
const getProjectData = async (url="") => {

    
    const response = await fetch(url);
    try{
        //Getting Project Data
        const data = await response.json();
        
        //Prepare UI for updating
        clearHistoryUI();

        //Updating UI
        updateRencentEntryUI(data[data.length-1]);
        updateHistoryUI(data);
        
    } catch (e) {
        console.log("Error", e);
    }
}

/* Function to GET Project Data */
const updateRencentEntryUI = (data) => {
    document.querySelector(".holder--body").style.display = "block";
    updateUI(data);
}

const clearHistoryUI = () => {
    document.querySelector(".entry__history").innerHTML = "";
};

/*Clear History UI  */
const updateHistoryUI = (data) => {
    let htmlmarkup =  '';
    for(let i = data.length-1; i >= 0; i--){
        htmlmarkup = 
        `${htmlmarkup}
        ${singleUIEntry(data[i])}`;
    }
    document.querySelector(".entry__history").insertAdjacentHTML("beforeend", htmlmarkup);
    document.querySelector(".entry__history--item:first-of-type").classList.add("active");
}

/* History UI Helper */
const singleUIEntry = (obj) => {
    const markup = 
    `<li class = "entry__history--item" id="">
        <div class = "item--title">
        <h3>${obj.place}</h3>
        <p>${obj.date}</p>
        </div>
        <div class = "item--details">
            <img class = "item-img" src = "${obj.img}" alt="${obj.cloudiness}">
            <div class = "item--content">
            <div class = "item--content--summary">
                <div class = "item-max-temp">
                ${obj.maxTemp} 
                </div>
                <div class = "item-min-temp">
                ${obj.minTemp} 
                </div>
                <div class = "item-cloudiness">
                ${obj.cloudiness}
                </div>
            </div>
            <div class = "item-windspeed">
                Wind Speed: ${obj.windspeed}
            </div>
            <div class = "item-cloudPer">
                Clouds: ${obj.cloudPer}
            </div>
            </div>
        </div>
        
    </li>`;
    return markup;
}

/* Update UI */
const updateUI = (data) => {
    document.querySelector(".js-place").innerHTML = data.place;
    document.querySelector(".js-country").innerHTML = data.country;
    document.querySelector(".js-date").innerHTML = data.date;
    document.querySelector(".js-img").setAttribute("src", data.img );
    document.querySelector(".js-temp").innerHTML = data.temperature;
    document.querySelector(".js-humidity").innerHTML = data.humidity;
    document.querySelector(".js-cloudiness").innerHTML = data.cloudiness;
    document.querySelector(".js-sunrise").innerHTML = data.sunrise;
    document.querySelector(".js-sunset").innerHTML = data.sunset;
    document.querySelector(".js-windspeed").innerHTML = data.windspeed;
    document.querySelector(".js-content").innerHTML = data.userResponse;
}

//TODO: Make a clickable History UI