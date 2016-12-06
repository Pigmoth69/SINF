var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var request = require('request');

router.get('/', function (req, res) {
    if (req.session.user == undefined)
        res.redirect('/login');
    else {
        if (req.session.admin == 'admin')
            res.redirect('/admin');
        else {
            var url = "http://localhost:" + config.PORT + "/api/clients/" + req.session.user;
            request.get({ url: url, proxy: config.PROXY }, function (error, response, wares) {
                if (!error && response.statusCode == 200) {
                    var client = JSON.parse(wares);
                    var ware = "http://localhost:" + config.PORT + "/api/utils/countries";
                    request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var countries = JSON.parse(body);
                            ware = "http://localhost:" + config.PORT + "/api/utils/paymenttypes";
                            request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var paymentTypes = JSON.parse(body);
                                    ware = "http://localhost:" + config.PORT + "/api/utils/paymentways";
                                    request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            var paymentWays = JSON.parse(body);
                                            ware = "http://localhost:" + config.PORT + "/api/utils/expeditionway";
                                            request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                                if (!error && response.statusCode == 200) {
                                                    var expeditionWay = JSON.parse(body);
                                                    ware = "http://localhost:" + config.PORT + "/api/utils/districts";
                                                    request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                                        if (!error && response.statusCode == 200) {
                                                            var districts = JSON.parse(body);
                                                            addCodes(client, paymentTypes, paymentWays, expeditionWay, countries, districts, function (result) {
                                                                // tratar das merdas para por la
                                                                res.render('profile', {
                                                                    profile: client, countries: countries, districts: districts, expeditionWay: expeditionWay,
                                                                    paymentTypes: paymentTypes, paymentWays: paymentWays, pWay: result.paymentWay, pType: result.paymentType,
                                                                    eWay: result.expeditionWay, country: result.country, district: result.district
                                                                });
                                                            });
                                                        }
                                                    });
                                                }
                                            }); // aceder a todos os formulários, ver quais é que não estão vazios, e mandar essa merda para o primavera e para a db
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
});

router.post('/edit', function (req, res) {
    var url = "http://localhost:" + config.PORT + "/api/..."; // MUDAR ESTA LINHA
    request.post({ url: quer, proxy: config.PROXY, headers: [{ 'Content-Type': 'application/json' }], json: form }, function (error, response, body) {
        if (!error && response.statusCode == 201) {
            res.send('success');
        }
        else {
            res.send('error');
        }
    });
});

function addCodes(result, paymentTypes, paymentWays, expeditionWays, countries, districts, next) {
    var temp = {};
    for (var i = 0; i < paymentTypes.length; i++) {
        if (paymentTypes[i].PaymentTypeCode == result.PaymentType) {
            temp.paymentType = paymentTypes[i].PaymentTypeDescription;
            paymentTypes[i].Selected = paymentTypes[i].PaymentTypeCode;
        }
        else {
            paymentTypes[i].Selected = "";
        }
    }
    for (var i = 0; i < paymentWays.length; i++) {
        if (paymentWays[i].PaymentWayCode == result.PaymentWay) {
            temp.paymentWay = paymentWays[i].PaymentWayDescription;
            paymentWays[i].Selected = paymentWays[i].PaymentWayCode;
        }
        else {
            paymentWays[i].Selected = "";
        }
    }
    for (var i = 0; i < expeditionWays.length; i++) {
        if (expeditionWays[i].ExpeditionCode == result.ExpeditionWay) {
            temp.expeditionWay = expeditionWays[i].ExpeditionDescription;
            expeditionWays[i].Selected = expeditionWays[i].ExpeditionCode;
        }
        else {
            expeditionWays[i].Selected = "";
        }
    }
    for (var i = 0; i < countries.length; i++) {
        if (countries[i].Initials == result.Country) {
            temp.country = countries[i].Name;
            countries[i].Selected = countries[i].Initials;
        }
        else {
            countries[i].Selected = "";
        }
    }
    for (var i = 0; i < districts.length; i++) {
        if (districts[i].DistrictCode == result.District) {
            temp.district = districts[i].Description;
            districts[i].Selected = districts[i].DistrictCode;
        }
        else {
            districts[i].Selected = "";
        }
    }

    if (typeof next == 'function') {
        next(temp);
    }
}

module.exports = router;