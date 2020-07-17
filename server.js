
// Setup empty JS object to act as endpoint for all routes
const projectData = [];

// Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require("body-parser");
const cors = require("cors");

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Spin up the server
const port = 3000;

// Callback to debug
app.listen(port, () => console.log(`The server is running on port ${port}`));

// Initialize all route with a callback function
app.get("/all", allCallBack);
app.post("/weather", addCallBack);

// Callback function to complete GET '/all'
function allCallBack (req, res) {
    res.send(projectData);
}

// Post Route
function addCallBack (req, res) {
    const data = req.body;
    projectData.push({
        place: data.place,
        country: data.country,
        img: data.img,
        windspeed: data.windspeed,
        maxTemp: data.maxTemp,
        minTemp: data.minTemp,
        humidity: data.humidity,
        cloudPer: data.cloudPer,
        cloudiness: data.cloudiness,
        sunrise: data.sunrise,
        sunset: data.sunset,
        temperature: data.temp,
        date: data.date,
        userResponse: data.userResponse
    });
}
