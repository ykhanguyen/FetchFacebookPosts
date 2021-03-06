var express = require('express');
var fetch = require('node-fetch');
var app = express();
const fs = require('fs');
var request = require('request');

var Clarifai = require('clarifai');
var app_clarify = new Clarifai.App(
    'FiQ89n95D_LEr5Rvc3fp38ft7nk7YKRdoI9Ke6u4',
    'V_VKYfUQOzitktQzsy13Z1Gt9_UxKJdmnlfw8c57'
);

app.disable('x-powered-by');

app.use(express.static(__dirname));


var handlebars = require('express-handlebars').create({defaultLayout: 'main'});


app.engine('handlebars', handlebars.engine);


app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3340);

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

app.get('/mood', function(req, res) {
    FB.setAccessToken("EAACEdEose0cBABL9EPi0dpvHhDwropUjmhMe9Jxxpmc6zyEeMjPWjz0kaJfG8TI3ePWhBHyDFSRWghi35XEmhgN8geZCFoiVbT1zu8ho2FvuovZBKTH1d4ZCtHrvW3JwEishVxZCRXZAQclrUqTAhAZB4R8xf3JTr2fpU3oxCKrwZDZD");
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

            //console.log(result);
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
            var dict_array = [];
            //console.log(response["data"][0]);

            for (var i = 0; i < response["data"].length && i < 7; i++) {
                var source = response["data"][i]["images"][0]["source"];
                var count = 0;
                var max = Math.min(response["data"].length, 7);
                var dict = {};
                var p1 = new Promise(
                    function(resolve, reject) {
                        // predict the contents of an image by passing in a url
                        app_clarify.models.predict(Clarifai.GENERAL_MODEL, source).then(
                            function(response) {
                                var concepts = response["data"]["outputs"][0]["data"]["concepts"];

                                count++;
                                for(var i = 0; i < concepts.length; i++) {
                                    var current = concepts[i].name;
                                    if (typeof dict[current] === "undefined") {
                                        dict[current] = 1;
                                    } else {
                                        dict[current] = dict[current] + 1;
                                    }
                                }
                                resolve(count);
                                //console.log(dict_array);

                            },
                            function(err) {
                                console.error(err);
                                reject(err);
                            }
                        );
                    });
                p1.then(
                    function(val) {
                        if (count == max) {
                            var sorted = [];
                            for(var key in dict) {
                                sorted[sorted.length] = key;
                            }
                            sorted.sort();
                            // console.log(sorted);
                            result = "";
                            for (var i = 0; i < sorted.length && i < 5; i++) {
                                result += sorted[i];
                            }
                            //console.log(result);
                            fetch('https://api.uclassify.com/v1/uclassify/sentiment/Classify?readkey=xQSx6uk7KsVm&text=' + result)
                                .then(function(res) {
                                    return res.json();
                                }).then(function(json) {
                                console.log(json);
                            });
                        }




                    }).catch(
                    function(reason) {
                        console.log('Handle rejected promise ('+reason+') here.');
                    });

            };


        }
    );
});




app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate');
});