var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var request = require('request');

router.get('/', function (req, res) {
    var ware = "http://localhost:" + config.PORT + "/api/utils/countries";
    request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var countries = JSON.parse(body);
            ware = "http://localhost:" + config.PORT + "/api/utils/districts";
            request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var districts = JSON.parse(body);
                    res.render('login', { countries: countries, districts: districts });
                }
                else {
                    res.render('404');
                }
            });
        }
    });
});

module.exports = router;