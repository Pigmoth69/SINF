var express = require('express');
var router = express.Router();
var db = require('../database/database.js');
var config = require('../config/config.js');
var request = require('request');
var utils = require('./utils.js');
var async = require('async');

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
                    if (req.session.user != undefined)
                        res.render('inventory', { warehouses: waresReal, families: famsT, id: req.session.user });
                    else res.render('inventory', { warehouses: waresReal, families: famsT });
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

router.get('/family/:idF', function (req, res) {
    db.getApprovedProducts(function (apprs) {
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
                returnApprovedProducts(apprs, temp, function (re) {
                    temp = re;
                    console.log(temp);
                    res.json(temp);
                });
            }
            else {
                res.render('404');
            }
        });
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

router.get('/logout', function (req, res, next) {
    console.log(req.session.user);
    if (req.session.user !== undefined) {
        req.session.user = undefined;
        res.redirect('/');
    } else {
        console.log("already logged out");
        res.redirect('/login');
    }
});

router.post('/register', function (req, res, next) {
    var quer = "http://localhost:" + config.PORT + "/api/client";
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
        db.registerUser(req.body.clientCode, req.body.name, req.body.password, "001", function (rows) {
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

router.get('/searchOnOtherPage/:query', function (req, res) {
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
                    db.getApprovedProducts(function (apprs) {
                        db.getProducts(function (prods) {
                            var quer = "http://localhost:" + config.PORT + "/api/products/search/" + req.params.query;
                            request.get({ url: quer, proxy: config.PROXY }, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var temp = JSON.parse(body);
                                    for (var i = 0; i < temp.length; i++) {
                                        temp[i].typeUser = req.session.typeUser;
                                    }
                                    var total = 0;
                                    var prodA = {};
                                    
                                    var utype = req.session.typeUser;
                                    if (utype == undefined) utype = 0;
                                    var j = 0;
                                    returnApprovedProducts(apprs, temp, function (re) {
                                        // tem de se usar o re
                                        temp = re;
                                        async.each(temp, function (item, callback) { 
                                            var prodURL2 = "http://localhost:49822/api/products?id=" + item.Code;
                                            request.get({ url: prodURL2, proxy: config.PROXY }, function (error2, response2, body) {
                                                if (!error2 && response2.statusCode == 200) {
                                                    var prod = JSON.parse(body);
                                                    var pvps = [
                                                        prod.Prices.PVP1,
                                                        prod.Prices.PVP1,
                                                        prod.Prices.PVP2,
                                                        prod.Prices.PVP3,
                                                        prod.Prices.PVP4,
                                                        prod.Prices.PVP5,
                                                        prod.Prices.PVP6
                                                    ];

                                                    item.Price = ((pvps[utype] * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                    item.Description = prod.Description;
                                                    item.PriceNo = Math.round((pvps[1] * (prod.IVA * 0.01 + 1) * 100))/ 100;
                                                    item.Price = item.Price.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                                                    item.PriceNo = item.PriceNo.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                                                    callback();
                                                }
                                                else {
                                                    console.log(response2.statusCode);
                                                }
                                            });
                                        }, function (err) {
                                            addImagesV2(apprs, temp, function (pro) {
                                                temp = pro;
                                                utils.getCategoriesPrimavera(function (cats) {
                                                    console.log(famsT);
                                                    if (req.session.user != undefined)
                                                        res.render('searchOtherPage', { warehouses: waresReal, families: famsT, id: req.session.user, items: temp});
                                                    else res.render('searchOtherPage', { warehouses: waresReal, families: famsT, items: temp});

                                                });
                                            });
                                        });
                                    });

                                }
                                else {
                                    res.render('404');
                                }
                            });
                        });
                    });

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

function addImagesV2(prods, temp, next) {
    for (var i = 0; i < temp.length; i++) {
        for (var j = 0; j < prods.length; j++) {
            console.log(temp[i]);
            if (temp[i].Code == prods[j].idProdutoPrimavera) {
                temp[i].Imagem = prods[j].imagem;
                j = prods.length;
            }
        }
    }

    for (var i = 0; i < temp.length; i++) {
        if (temp[i].Imagem == "")
            temp[i].Imagem = 'product.png';
    }
    if (typeof next == 'function')
        next(temp);
}

router.get('/search/:query', function (req, res) {
    db.getApprovedProducts(function (apprs) {
        console.log(req.params);
        var quer = "http://localhost:" + config.PORT + "/api/products/search/" + req.params.query;
        request.get({ url: quer, proxy: config.PROXY }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var temp = JSON.parse(body);
                for (var i = 0; i < temp.length; i++) {
                    temp[i].typeUser = req.session.typeUser;
                }
                returnApprovedProducts(apprs, temp, function (re) {
                    console.log(temp);
                    temp = re;
                    res.json(temp);
                });
            }
            else {
                res.render('404');
            }
        });
    });
});

function returnApprovedProducts(prods, prodsPri, next) {
    var result = [];
    for (var i = 0; i < prodsPri.length; i++) {
        for (var j = 0; j < prods.length; j++) {
            if (prods[j].idProdutoPrimavera == prodsPri[i].Code) {
                result.push(prodsPri[i]);
            }
        }
    }
    if (typeof next == 'function')
        next(result);
}

router.get('/addProductToCart/:idP/:quantity', function (req, res) {
    console.log("idP" + req.params.idP + " user " +  req.session.user + " qty " + req.params.quantity)
    if (req.session.user == undefined) {
        console.log("login?");
        res.redirect('/login');
    }
    else {
        db.addProductToCart(req.params.idP, req.session.user, req.params.quantity, function (suc) {
            console.log("SUC = " + suc);
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
