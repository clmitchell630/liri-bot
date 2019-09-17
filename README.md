# liri-bot

This CLI app aims to assist the user in three ways: helping locate concert venues for your favorite artist, find song information/links, and look up information on movies you're interested in.

By inputting your your favorite artist into liri you can find the venues that they are playing in, where those venues are, and what date/time the event is occuring. If you give liri a track, it will list songs from a variety of arists that meet your search term and give you a link to listen to the song. Finally, if you give liri a movie title, it will list information about the movie from where it was produced to what the ratings for the movie were.

## The app and how it works

Liri utilizes Node.js and CLI as well as the following packages and APIs:

*   Node packages
    1.  node-spotify-api
    2.  axios
    3.  moment
    4.  dotenv
    5.  fs

*   APIs used
    1.  Spotify
    2.  BandsInTown
    3.  OMDB

After initiallizing the packages for use within the app, we set up a way to target user input. This is done by looking at Node's process.argv array and targeting the user's input at index 2 and beyond.

The app takes in the index 2 input with one of 4 commands:
1.  concert-this
2.  spotify-this-song
3.  movie-this
4.  do-what-it-says

Which command you use will determine which function is excecuted within the app. The following inputs will be used to excecute searches within the APIs that are called in the functions. Finally, the app will display the returned responses from the api in CLI.

## How to use

1.  Start by entering the following arguments in the command line.
    ```
    node liri.js    
    ```
    *   This will enable us to use the app with node.
2.  Enter the third argument - one of the 4 following commands:
    -   concert-this
    -   spotify-this-song
    -   movie-this
    -   do-what-it-says
    ```
    node liri.js concert-this
    ```
3.  Finally, enter what it is you want to search for.
    ```
    node liri.js concert-this backstreet boys
    ```
4.  Enjoy!

