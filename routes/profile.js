var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var request = require('request');

router.get('/', function (req, res) {
    if (req.session.user == undefined)
        res.redirect('/login');
    else {
        var url = "http://localhost:" + config.PORT + "/api/clients/" + req.session.user;
        request.get({ url: url, proxy: config.PROXY }, function (error, response, wares) {
            if (!error && response.statusCode == 200) {
                var client = JSON.parse(wares);
                var ware = "http://localhost:" + config.PORT + "/api/utils/countries";
                request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var countries = JSON.parse(body);
                        ware = "http:localhost:" + config.PORT + "api/utils/paymenttypes";
                        request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var paymentTypes = JSON.parse(body);
                                ware = "http:localhost:" + config.PORT + "api/utils/paymentways";
                                request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        var paymentWays = JSON.parse(body);
                                        ware = "http:localhost:" + config.PORT + "api/utils/expeditionway";
                                        request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                            if (!error && response.statusCode == 200) {
                                                var expeditionWay = JSON.parse(body);
                                                ware = "http://localhost:" + config.PORT + "/api/utils/districts";
                                                request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                                    if (!error && response.statusCode == 200) {
                                                        var districts = JSON.parse(body);
                                                        res.render('profile', { profile: client, countries: countries, districts: districts, expeditionWay : expeditionWay,
                                                                                paymentTypes : paymentTypes, paymentWays : paymentWays});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    }

});

router.get('/edit', function (req, res) {

});

module.exports = router;