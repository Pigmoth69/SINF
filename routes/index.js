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

router.post('/login', function (req, res, next) {
    console.log("entra aqui " + req.body.username + " e " + req.body.password);
    if (req.session.user === undefined) {
        db.compareLogin(req.body.username, req.body.password, function (rows) {
            if (rows[0] != undefined) {
                req.session.user = rows[0].idUser;
                req.session.name = rows[0].username;
                req.session.typeUser = rows[0].tipo;
                console.log("login correto");
                res.redirect('/');
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
