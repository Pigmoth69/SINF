var express = require('express');
var router = express.Router();
var db = require('../database/database.js');
var request = require('request');


router.get('/', function (req, res) {
    request.get({ url: "http://localhost:49822/api/warehouse", proxy: 'http://localhost:49822' }, function (error, response, wares) {
        if (!error && response.statusCode == 200) {
            request.get({ url: "http://localhost:49822/api/products/family", proxy: 'http://localhost:49822' }, function (error, response, fams) {
                if (!error && response.statusCode == 200) {
                    var waresReal = JSON.parse(wares);
                    var famsReal = JSON.parse(fams);
                    var famsT = [];
                    for (var i = 0; i < famsReal.length; i++) {
                        famsT[i] = {};
                        famsT[i].Code = famsReal[i];
                    }
                    res.render('inventory', { warehouses: waresReal, families: famsT });
                }
                else {
                    res.render('404');
                }
            });
        }
        else {
            res.render('404');
        }
    });
});

router.get('/warehouse/:idW/family/:idF', function (req, res) {
    var ware = "http://localhost:49822/api/products?warehouseId=" + req.params.idW + "&familyId=" + req.params.idF;
    console.log(ware);
    request.get({ url: ware, proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            for (var i = 0; i < temp.length; i++) {
                temp[i].typeUser = req.session.typeUser;
            }
            res.json(temp);
        }
        else {
            res.render('404');
        }
    });
});

router.get('/warehouse/:idW/', function (req, res) {
    var ware = "http://localhost:49822/api/warehouse?warehouseId=" + req.params.idW;
    request.get({ url: ware, proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            for (var i = 0; i < temp.length; i++) {
                temp[i].typeUser = req.session.typeUser;
            }
            res.json(temp);
        }
        else {
            res.render('404');
        }
    });
});

router.get('/family/:idF', function (req, res) {
    var ware = "http://localhost:49822/api/products/family/" + req.params.idF;
    request.get({ url: ware, proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            for (var i = 0; i < temp.length; i++) {
                temp[i].typeUser = req.session.typeUser;
            }
            res.json(temp);
        }
        else {
            res.render('404');
        }
    });
});

router.get('/database/products', function (req, res) {
    db.getProducts(function (prods) {
        if (prods.length > 0)
            res.json(prods);
        else res.json('fuck');
    });
});

router.get('/search/:query', function (req, res) {
    var quer = "http://localhost:49822/api/products/search/" + req.params.query;
    request.get({ url: quer, proxy: "http://localhost:49822" }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            for (var i = 0; i < temp.length; i++) {
                temp[i].typeUser = req.session.typeUser;
            }
            res.json(temp);
        }
        else {
            res.render('404');
        }
    });
});


module.exports = router;
