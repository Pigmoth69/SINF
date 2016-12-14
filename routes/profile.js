var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var request = require('request');
var db = require('../database/database.js');
var utils = require('./utils.js');

router.get('/', function (req, res) {
    if (req.session.user == undefined)
        res.redirect('/login');
    else {
        if (req.session.admin == 'admin')
            res.redirect('/admin');
        else {
            var url = "http://localhost:" + config.PORT + "/api/clients?id=" + req.session.user;
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
                                                            ware = "http://localhost:" + config.PORT + "/api/clients/types";
                                                            request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
                                                                if (!error && response.statusCode == 200) {
                                                                    var clientTypes = JSON.parse(body);
                                                                    addCodes(client, paymentTypes, paymentWays, expeditionWay, countries, districts, clientTypes, function (result) {
                                                                        // tratar das merdas para por la
                                                                        utils.getCategoriesPrimavera(function(cats) {
                                                                            res.render('profile1', {
                                                                                profile: client, countries: countries, districts: districts, expeditionWay: expeditionWay,
                                                                                paymentTypes: paymentTypes, paymentWays: paymentWays, pWay: result.paymentWay, pType: result.paymentType,
                                                                                eWay: result.expeditionWay, country: result.country, district: result.district, clientTypes: clientTypes,
                                                                                cType: result.clientType, id : req.session.user, families : cats
                                                                            });
                                                                        });
                                                                    });
                                                                }
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
    var quer = "http://localhost:" + config.PORT + "/api/clients?id=" + req.body.codClient; // MUDAR ESTA LINHA
    //console.log(req.body);
    db.requestType(req.session.user, req.body.clientType + "", function (rows) {
        var form = req.body;
        form.ClientDiscount = 0;
        form.Currency = "";
        form.ClientType = "";

        //@TODO ver as password
        request.put({ url: quer, proxy: config.PROXY, json: form }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.redirect('/profile');
            }
            else {
                res.render('404');
            }
        });
    });
});

function redirectAfterEdit(resp, res) {
    if (resp == 'success') {
        res.redirect('/profile');
    }
    else {
        res.render('404');
    }
}

router.post('/editText', function (req, res) {
    switch (req.body.name) {
        case 'clientName':
            editField(req.body.pk, req.body.value, "", "", "", "", "", function (resp) {
                redirectAfterEdit(resp, res);
            });
            break;
        case 'fiscalName':
            editField(req.body.pk, "", req.body.value, "", "", "", "", function (resp) {
                redirectAfterEdit(resp, res);
            });
            break;
        case 'address':
            editField(req.body.pk, "", "", req.body.value, "", "", "", function (resp) {
                redirectAfterEdit(resp, res);
            });
            break;
        case 'email':
            editField(req.body.pk, "", "", "", req.body.value, "", "", function (resp) {
                redirectAfterEdit(resp, res);
            });
            break;
        case 'phone':
            editField(req.body.pk, "", "", "", "", req.body.value, "", function (resp) {
                redirectAfterEdit(resp, res);
            });
            break;
        case 'taxpay':
            editField(req.body.pk, "", "", "", "", "", req.body.value, function (resp) {
                redirectAfterEdit(resp, res);
            });
            break;
    }
});

function editField(id, cName, fName, addr, email, phone, tax, next) {
    var quer = "http://localhost:" + config.PORT + "/api/clients?id=" + id; // MUDAR ESTA LINHA
    var form = {};
    form.NameClient = cName;
    form.FiscalName = fName;
    form.Address = addr;
    form.Email = email;
    form.Phone = phone;
    form.TaxpayNumber = tax;
    form.CodClient = id;
    form.Address2 = "";
    form.ClientType = "";
    form.Country = "";
    form.Currency = "";
    form.District = "";
    form.ExpeditionWay = "";
    form.Local = "";
    form.PaymentType = "";
    form.PaymentWay = "";
    form.Phone2 = "";
    form.ClientDiscount = 0;
    form.PostCode = "";
    console.log(form);

    request({ method: 'PUT', url: quer, proxy: config.PROXY, json: form }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (typeof next == 'function') {
                next('success');
            }
        }
        else {
            if (typeof next == 'function') {
                console.log(response.statusCode);
                next('error');
            }
        }
    });
}

function addCodes(result, paymentTypes, paymentWays, expeditionWays, countries, districts, clientTypes, next) {
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
    for (var i = 0; i < clientTypes.length; i++) {
        if (clientTypes[i].Code == result.ClientType) {
            temp.clientType = clientTypes[i].Description;
            clientTypes[i].Selected = clientTypes[i].Code;
        }
        else {
            clientTypes[i].Selected = "";
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