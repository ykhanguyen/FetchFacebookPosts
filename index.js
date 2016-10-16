var express = require('express');

var app = express();
const fs = require('fs');
var request = require('request');

app.disable('x-powered-by');


var handlebars = require('express-handlebars').create({defaultLayout: 'main'});


app.engine('handlebars', handlebars.engine);


app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3334);

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

FB.setAccessToken("EAACEdEose0cBAHII80vqERySY0cCRFIwLDyNXM7ZBFUuWi2LoM5MqHV85z1JojZBxv7liwAZCcQeI8417MqfTwSmVXVKlvdvvPZBCPL6wouemfAffAJPFWePDNkBodzZB0x6ZB7B3njLQm6hNsKN5yGg2W9FJShIUvUVTeUeOCjQZDZD");
FB.api(
    '/me/posts',
    'GET',
    {},
    function(response) {
        // Insert your code here
        console.log(response);
    }
);

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate');
});