var express = require('express');
var fetch = require('node-fetch');
var app = express();
const fs = require('fs');
var request = require('request');

app.disable('x-powered-by');

app.use(express.static(__dirname));


var handlebars = require('express-handlebars').create({defaultLayout: 'main'});


app.engine('handlebars', handlebars.engine);


app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3336);

var FB = require('fb');
FB.options({version: 'v2.8'});
FB.api('oauth/access_token', {
    client_id: '785828631519992',
    client_secret: '5e8bd30a6c03fd70d1231fbc67bedb37',
    grant_type: 'client_credentials'
}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }

    var accessToken = res.access_token;
    console.log("my access token");
    FB.setAccessToken(accessToken);
    console.log(accessToken);
});





/*
var FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new FacebookTokenStrategy({
        clientID: 785828631519992,
        clientSecret: "5e8bd30a6c03fd70d1231fbc67bedb37"
    }, function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({facebookId: profile.id}, function (error, user) {
            return done(error, user);
        });
    }
));
*/

FB.setAccessToken("EAACEdEose0cBAGZCEi58WkADAFip7HTyZC7DJuJQfH6j4NZBsb4S8ybE17nqGoD22wArfBCbwfGTjGCGxe5OYohoRjR7VmfC1Vrcul7doUIfoI3WEQfJQZBmZAoH4cFDli3W6qdHN7lqMkbJ9zkEq2GF8DSzkSqAimKesfIA2XIQcecH63i7q4FTJGEtQP7CNxgwZBLAyjbAZDZD");
FB.api(
    '/me/posts',
    'GET',
    {},
    function(response) {
        // Insert your code here
        //console.log(response["data"]);
        data = response["data"];
        var result = "";
        for (var i = 0; i < data.length; i++) {
            if (typeof data[i]["message"] !== "undefined") {
                result += data[i]["message"];
            }
        }

        console.log(result);
        fetch('https://api.uclassify.com/v1/uclassify/sentiment/Classify?readkey=xQSx6uk7KsVm&text=' + result)
            .then(function(res) {
                return res.json();
            }).then(function(json) {
            console.log(json);
        });
    }
);




FB.api(
    '/me/photos',
    'GET',
    {"fields":"images"},
    function(response) {
        // Insert your code here

        //console.log(response["data"][0]);
        //console.log(response["data"][5]);
    }
);







app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate');
});