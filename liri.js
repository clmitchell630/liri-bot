
// DotEnv
require("dotenv").config();
//Spotify Keys
var keys = require("./keys.js");
// Node-Spotify-API
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
// Axios - for OMDB API and Bands In Town API
var axios = require("axios");
// Moment
var moment = require("moment");
// fs
var fs = require("fs");

//handling arguments
var nodeArgs = process.argv;
var method = process.argv[2];
var userQuery = "";
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        userQuery = userQuery + "+" + nodeArgs[i];
    } else {
        userQuery += nodeArgs[i];

    }
}

//spacer
var spacer = "===========================\n";

liriBot();

//========== FUNCTIONS ==========

function liriBot() {
    switch (method) {
        case 'concert-this': bandsInTown();
            break;

        case 'spotify-this-song':
            if (nodeArgs.length === 3) {
                spotifyEmpty();
            } else {
                spotifyThis();
            }
            break;

        case 'movie-this':
            if (nodeArgs.length === 3) {
                movieEmpty();
            } else {
                movieSearch();
            }
            break;

        case 'do-what-it-says': liriThis();
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
}
function bandsInTown() {

    //Bands-in-town url
    var bands = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp";

    axios.get(bands).then(function (response) {
        // console.log(response);
        console.log(userQuery);
        if (response.data.length === 0) {
            console.log(spacer);
            console.log("This artist does not have any upcoming events!\n");
            console.log(spacer);
        } else if (response.data === '\n{warn=Not found}\n') {
            console.log(spacer);
            console.log("This is not a valid artist...\n");
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

function spotifyThis() {

    spotify.search({ type: 'track', query: userQuery, limit: 10 }, function (err, data) {
        if (err) {
            return console.log("Spotify Error occured: " + err);
        }
        // console.log(data);
        if (data.tracks.items.length === 0) {
            console.log(spacer);
            console.log("Please enter a valid song name...\n");
            console.log(spacer);

        } else {

            for (var j = 0; j < data.tracks.items.length; j++) {

                console.log("=====Artists=====");

                for (var x = 0; x < data.tracks.items[j].artists.length; x++) {

                    var songArtists = "";
                    if (x > 0 && x < data.tracks.items[j].artists.length) {

                        var strArtists = data.tracks.items[j].artists[x].name;
                        songArtists = songArtists + strArtists;

                    } else {
                        songArtists += strArtists;

                    }

                    console.log(parseInt(x + 1) + ". " + songArtists);

                }

                console.log("\nSong Name: " + data.tracks.items[j].name + "\n" +
                    "Preview Link: " + data.tracks.items[j].external_urls.spotify + "\n" +
                    "Album: " + data.tracks.items[j].album.name + "\n"
                );
                console.log(spacer);

            }
        }
    });

}

function spotifyEmpty() {
    spotify.search({ type: 'track', query: "the sign" }, function (err, data) {
        if (err) {
            return console.log("Spotify Error occured: " + err);
        }
        console.log("=====Artists=====");
        console.log(1 + ". " + data.tracks.items[4].album.artists.name);

        console.log("\nSong Name: " + data.tracks.items[4].name + "\n" +
            "Preview Link: " + data.tracks.items[4].external_urls.spotify + "\n" +
            "Album: " + data.tracks.items[4].album.name + "\n"
        );
        console.log(spacer);
    });
}

function movieSearch() {

    //OMDB url
    var movies = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

    axios.get(movies).then(function (response) {
        // console.log(response);
        // console.log(userQuery);
        if (response.data.Response === "False") {
            console.log(spacer);
            console.log("Please enter a valid movie title...\n");
            console.log(spacer);

        } else {
            var rottenTom = "";
            for (var y = 0; y < response.data.Ratings.length; y++) {
                if (response.data.Ratings[y].Source === "Rotten Tomatoes") {
                    rottenTom = response.data.Ratings[y].Value;
                } else {
                    continue;
                }
            }

            console.log(spacer);
            console.log("Movie Title: " + response.data.Title + "\n" +
                "Release date: " + response.data.Year + "\n" +
                "IMDB Rating: " + response.data.imdbRating + "/10\n" +
                "Rotten Tomatoes Rating: " + rottenTom + "\n" +
                "Produced in: " + response.data.Country + "\n" +
                "Languages: " + response.data.Language + "\n" +
                "----- PLOT -----\n" + response.data.Plot + "\n----------------\n" +
                "Actors: " + response.data.Actors
            );
            console.log(spacer);
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

function movieEmpty() {
    movies = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
    axios.get(movies).then(function (response) {
        // console.log(response);
        // console.log(userQuery);
        var rottenTom = "";
        for (var y = 0; y < response.data.Ratings.length; y++) {
            if (response.data.Ratings[y].Source === "Rotten Tomatoes") {
                rottenTom = response.data.Ratings[y].Value;
            } else {
                continue;
            }
        }

        console.log(spacer);
        console.log("Movie Title: " + response.data.Title + "\n" +
            "Release date: " + response.data.Year + "\n" +
            "IMDB Rating: " + response.data.imdbRating + "/10\n" +
            "Rotten Tomatoes Rating: " + rottenTom + "\n" +
            "Produced in: " + response.data.Country + "\n" +
            "Languages: " + response.data.Language + "\n" +
            "----- PLOT -----\n" + response.data.Plot + "\n----------------\n" +
            "Actors: " + response.data.Actors
        );
        console.log(spacer);



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

function liriThis() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        for (var z = 0; z < dataArr.length; z++) {
            process.argv.push(dataArr[z]);
        }
        process.argv.splice(2, 1);

        nodeArgs = process.argv;
        // console.log(nodeArgs);


        method = process.argv[2];
        userQuery = "";
        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 3 && i < nodeArgs.length) {
                userQuery = userQuery + "+" + nodeArgs[i];
            } else {
                userQuery += nodeArgs[i];

            }
        }

        liriBot();

    });

}