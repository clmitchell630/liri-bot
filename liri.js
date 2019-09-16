// Node-Spotify-API
// Axios - for OMDB API and Bands In Town API
// Moment
// DotEnv

require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);