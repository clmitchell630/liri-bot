
// DotEnv
require("dotenv").config();
//Spotify Keys
var keys = require("./keys.js");
// Node-Spotify-API
//var spotify = new Spotify(keys.spotify);
var Spotify = require("node-spotify-api");
// Axios - for OMDB API and Bands In Town API
var axios = require("axios");
// Moment
var moment = require("moment");

//handling arguments
var nodeArgs = process.argv;
var method = process.argv[2];
var query = "";
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        query = query + "+" + nodeArgs[i];
    } else {
        query += nodeArgs[i];

    }
}

//Bands-in-town url
var bands = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";

//OMDB url
var movie = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";

//spacer
var spacer = "======================";

switch (method) {
    case 'concert-this': bandsInTown();
        break;

    case 'spotify-this-song':
        break;

    case 'movie-this':
        break;

    case 'do-what-it-says':
        break;

    default:
        console.log("I'm sorry, " + method + " is not a valid command.\n" +
            "======Try these!======\n" +
            "concert-this\n" +
            "spotify-this-song\n" +
            "movie-this\n" +
            "do-what-it-says\n"
        );
}

function bandsInTown() {

    axios.get(bands).then(function (response) {
        // console.log(response);
        console.log(query);
        if (response.data.length === 0) {
            console.log(spacer);
            console.log("This artist does not have any upcoming events!");
            console.log(spacer);
        } else if (response.data === '\n{warn=Not found}\n') {
            console.log(spacer);
            console.log("This is not a valid artist!");
            console.log(spacer);

        } else {
            
            for (var i = 0; i < response.data.length; i++) {
                
                var venueLoc;
                var concertDate = moment(response.data[i].datetime).format("M/DD/YY, h:mma");

                if (response.data[i].venue.region === "") {
                    venueLoc = "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country + "\n";
                } else {
                    venueLoc = "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country + "\n";
                }

                console.log(spacer);
                console.log("Concert Venue " + i + "\n");
                console.log("Venue Name: " + response.data[i].venue.name + "\n" +
                    venueLoc +
                    "Concert Date/Time: " + concertDate + "\n"
                );
                console.log(spacer);

            }
        }


    })
        .catch(function (error) {
            if (error.response) {
                console.log("-----------Data-----------");
                console.log(error.response.data);
                console.log("-----------Status-----------");
                console.log(error.response.status);
                console.log("-----------Status-----------");
                console.log(error.response.headers);
            }
            else if (error.request) {
                console.log(error.request);
            }
            else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });

}