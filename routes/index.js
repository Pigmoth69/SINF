var express = require('express');
var router = express.Router();
var db = require('../database/database.js');
var config = require('../config/config.js');
var request = require('request');


router.get('/', function (req, res) {
    if (req.session.discount == undefined)
        req.session.discount = 0;
    var url = "http://localhost:" + config.PORT + "/api/warehouse";
    request.get({ url: url, proxy: config.PROXY }, function (error, response, wares) {
        if (!error && response.statusCode == 200) {
            url = "http://localhost:" + config.PORT + "/api/products/family";
            request.get({ url: url, proxy: config.PROXY }, function (error, response, fams) {
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
            console.log(error);
            res.render('404');
        }
    });
});

router.get('/warehouse/:idW/family/:idF', function (req, res) {
    var ware = "http://localhost:" + config.PORT + "/api/products?warehouseId=" + req.params.idW + "&familyId=" + req.params.idF;
    console.log(ware);
    // há aqui um erro ???
    request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            console.log(temp);
            for (var i = 0; i < temp.length; i++) {
                temp[i].typeUser = req.session.typeUser;
                if (req.session.user != undefined)
                    temp[i].disc = req.session.discount;
                else temp[i].disc = 0;
            }
            res.json(temp);
        }
        else {
            res.render('404');
        }
    });
});

router.get('/warehouse/:idW/', function (req, res) {
    var ware = "http://localhost:" + config.PORT + "/api/warehouse?warehouseId=" + req.params.idW;
    request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            for (var i = 0; i < temp.length; i++) {
                temp[i].typeUser = req.session.typeUser;
                if (req.session.user != undefined)
                    temp[i].disc = req.session.discount;
                else temp[i].disc = 0;
            }
            res.json(temp);
        }
        else {
            res.render('404');
        }
    });
});

router.get('/family/:idF', function (req, res) {
    var ware = "http://localhost:" + config.PORT + "/api/products/family/" + req.params.idF;
    request.get({ url: ware, proxy: config.PROXY }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            for (var i = 0; i < temp.length; i++) {
                temp[i].typeUser = req.session.typeUser;
                if (req.session.user != undefined)
                    temp[i].disc = req.session.discount;
                else temp[i].disc = 0;
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

router.post('/login', function (req, res, next) {
    if (req.session.user === undefined) {
        db.compareLogin(req.body.username, req.body.password, function (rows) {
            if (rows[0] != undefined) {
                var quer = "http://localhost:" + config.PORT + "/api/clients?id=" + rows[0].idUser;
                request.get({ url: quer, proxy: config.PROXY }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var cl = JSON.parse(body);
                        req.session.user = rows[0].idUser;
                        req.session.name = rows[0].username;
                        req.session.typeUser = rows[0].tipo;
                        req.session.discount = cl.ClientDiscount;
                        if (req.body.username == 'admin')
                            req.session.admin = 'admin';

                        console.log("login correto");
                        res.redirect('/');
                    }
                });
            } else {
                console.log("credenciais erradas");
                res.redirect('/login');
            }
        });
    } else {
        console.log("already logged in");
        res.redirect('/login');
    }
});

router.post('/register', function (req, res, next) {
    var quer = "http://localhost:" + config.PORT + "/api/Clients";
    var form = {};
    form.Address = req.body.address;
    form.Address2 = "";
    form.ClientDiscount = 0;
    form.ClientType = "001";
    form.CodClient = req.body.clientCode;
    form.Country = req.body.country; //esperar query do reis
    form.Currency = "EUR";
    form.District = req.body.district;
    form.Email = req.body.email;
    form.ExpeditionWay = "";
    form.FiscalName = req.body.fiscal_name;
    form.Local = req.body.local;
    form.NameClient = req.body.name;
    form.PaymentType = "";
    form.PaymentWay = "";
    form.Phone = req.body.phone;
    form.Phone2 = "";
    form.PostCode = req.body.zip;
    form.TaxpayNumber = req.body.taxpay;
    console.log(form);

    if (req.body.password != req.body.password2) {
        res.redirect('/login');
    }
    else {
        db.registerUser(req.body.clientCode, req.body.name, req.body.password, form.ClientType, function (rows) {
            request.post({ url: quer, proxy: config.PROXY, headers: [{ 'Content-Type': 'application/json' }], json: form }, function (error, response, body) {
                if (!error && response.statusCode == 201) {
                    console.log(response.statusCode);
                    res.redirect('/');
                }
                else if (body == 'resposta merda do reis') {

                }
                else if (body == 'resposta merda do reis 2') {

                }
                else {
                    console.log(response.statusCode);
                    res.render('404');
                }
            });

        });
    }

});

router.get('/search/:query', function (req, res) {
    var quer = "http://localhost:" + config.PORT + "/api/products/search/" + req.params.query;
    request.get({ url: quer, proxy: config.PROXY }, function (error, response, body) {
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

router.get('/addProductToCart/:idP', function (req, res) {
    if (req.session.user == undefined) {
        res.redirect('/login');
    }
    else {
        db.addProductToCart(req.params.idP, req.session.user, function (suc) {
            if (suc == 'success') {
                res.redirect('/cart');
            }
            else {
                res.render('404');
            }
        });
    }
});

router.get('/removeProductFromCart/:idP/:quant', function (req, res) {
    if (req.session.user == undefined) {
        res.redirect('/login');
    }
    else {
        db.removeProductFromCart(req.params.idP, req.session.user, req.params.quant, function (suc) {
            if (suc == 'sem problema') {
                res.redirect('/cart');
            }
            else {
                res.render('404');
            }
        });
    }
});


module.exports = router;
