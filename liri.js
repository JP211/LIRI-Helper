//Initial welcome and command info - on load of liri.js for convenience 
console.log("Hello, my name is Liri. How can I help today?\n(Please enter a command)\n* my-tweets\n* spotify-this-song\n* movie-this\n* do-what-it-says");

//For the dependencies
var twKeys = require("./keys.js");
var fs = require('fs'); // to read the keys.js file
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');


// Twitter (my-tweets)
var getTweets = function() {
    var client = new twitter(twKeys.twitterKeys);

    var params = { screen_name: 'codecoconut', count: 10 };

    client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (!error) {
            var data = [];
            for (var i = 0; i < tweets.length; i++) {
                data.push({
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text,
                });
            }
            console.log(data);
        }
    });
};


//Spotify (spotify-this-song)

var spotify = new spotify({
    id: 'a14c9732339d4f16802a936fa1fd3747',
    secret: 'c780324356784d84abbdbc5008f39f8a'
});

var getMeSpotify = function(songName) {

    //If it doesn't find a song, defaults to "The Sign" by Ace of Base
    if (songName === undefined) {
        songName = 'The Sign';
    };

    //For finding artist(s) name on spotify
    var getArtistNames = function(artist) {
        return artist.name;
    };

    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;
        var data = [];

        for (var i = 0; i < songs.length; i++) {
            data.push({
                'artist(s)': songs[i].artists.map(getArtistNames),
                'song name: ': songs[i].name,
                'preview song: ': songs[i].preview_url,
                'album: ': songs[i].album.name,
            });
        }
        console.log(data);
    });
};

//OMDB (movie-this)

var getMeMovie = function(movieName) {

    if (movieName === undefined) {
        movieName = 'Mr. Nobody';
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(urlHit, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = [];
            var jsonData = JSON.parse(body);

            data.push({
                'Title: ': jsonData.Title,
                'Year: ': jsonData.Year,
                'Rated: ': jsonData.Rated,
                'IMDB Rating: ': jsonData.imdbRating,
                'Country: ': jsonData.Country,
                'Language: ': jsonData.Language,
                'Plot: ': jsonData.Plot,
                'Actors: ': jsonData.Actors,
                'Rotten Tomatoes Rating: ': jsonData.tomatoRating,
                'Rotton Tomatoes URL: ': jsonData.tomatoURL,
            });
            console.log(data);
        }
    });

}

//Liri will choose a command from random.txt (do-what-it-says)

var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        var dataArr = data.split(',')

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0]);
        }

    });
}

//To choose which action to take
var command = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getTweets();
            break;
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('I do not know what you mean, please try again.');
    }
}

var runThis = function(argOne, argTwo) {
    command(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);
