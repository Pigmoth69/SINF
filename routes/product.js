var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../database/database.js');
var config = require('../config/config.js');
var utils = require('./utils.js');

router.get('/', function (req, res) {
    res.render('product');
});

router.post('/:idP/newComment', function (req, res) {
    db.commentOnProduct(req.body.comentario, req.params.idP, req.session.user, function (resp) {
        if (resp == 'success')
            res.redirect('/product/' + req.params.idP);
        else res.render('404');
    });
});

router.get('/:idP', function (req, res) {
    console.log("ID produto = " + req.params.idP);
    db.getProductByID(req.params.idP, function (rows) {
        if (rows.length > 0) { //aprovado
            var prodURL = "http://localhost:" + config.PORT + "/api/products?id=" + req.params.idP;

            request.get({ url: prodURL, proxy: config.PROXY }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var tempB = JSON.parse(body);
                    db.getProducts(function (prods) {
                        db.getCommentsOnProduct(tempB.Code, function (comments) {
                            db.getUsers(function (users) {
                                var stk;
                                if (tempB.STKActual < 0)
                                    stk = "no";
                                else stk = tempB.STKActual + 0;
                                tempB.stk = stk;
                                var iva;
                                var price;

                                addImagesToProducts(prods, tempB, comments, users, function (pr, t, cs) {
                                    prods = pr;
                                    tempB = t;
                                    comments = cs;
                                    prodURL = "http://localhost:" + config.PORT + "/api/products/family/" + tempB.Family;
                                    console.log(prodURL);
                                    request.get({ url: prodURL, proxy: config.PROXY }, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            var relatedProducts = JSON.parse(body);
                                            db.getApprovedProducts(function (appr) {
                                                approvedProducts(relatedProducts, appr, function (rp) {
                                                    relatedProducts = rp;
                                                    if (relatedProducts.length > 10)
                                                        relatedProducts = relatedProducts.slice(0, 10);

                                                    if (req.session.user != undefined)
                                                        prodURL = "http://localhost:" + config.PORT + "/api/clients?id=" + req.session.user;
                                                    else prodURL = "http://localhost:" + config.PORT + "/api/clients?id=ALCAD";
                                                    request.get({ url: prodURL, proxy: config.PROXY }, function (error, response, body) {
                                                        if (!error && response.statusCode == 200) {
                                                            var cl = JSON.parse(body);
                                                            utils.getCategoriesPrimavera(function (cats) {
                                                                addImages(prods, relatedProducts, function (rp1) {

                                                                    var pvps = [
                                                                        tempB.Prices.PVP1,
                                                                        tempB.Prices.PVP1,
                                                                        tempB.Prices.PVP2,
                                                                        tempB.Prices.PVP3,
                                                                        tempB.Prices.PVP4,
                                                                        tempB.Prices.PVP5,
                                                                        tempB.Prices.PVP6
                                                                    ];
                                                                    relatedProducts = rp1;
                                                                    var price_no = Math.round(tempB.Prices.PVP1 * (tempB.IVA * 0.01 + 1) * 100) / 100;

                                                                    if (req.session.user != undefined) {
                                                                        price = pvps[req.session.typeUser] * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        iva = (pvps[req.session.typeUser] * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                    }
                                                                    else {
                                                                        price = pvps[0] * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        iva = (pvps[0] * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                    }
                                                                    price = Math.round(price * 100) / 100;
                                                                    iva = Math.round(iva * 100) / 100;

                                                                    if (req.session.user != undefined) {
                                                                        console.log("TOTA:" + req.session.totalCart);
                                                                        var total = req.session.totalCart.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                                                                        res.render('product1', {
                                                                            product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments, id: req.session.name, price: price, price_no: price_no,
                                                                            disc: cl.ClientDiscount, relatedProducts: relatedProducts, id: req.session.user, families: cats, total: total
                                                                        });
                                                                    }
                                                                    else res.render('product1', {
                                                                        product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price, price_no: price_no, disc: 0, relatedProducts: relatedProducts,
                                                                        families: cats
                                                                    });

                                                                });
                                                            });
                                                        }
                                                        else {
                                                            console.log("/api/clients?id=" + req.session.user + " = " + response.statusCode);
                                                            res.render('404');
                                                        }
                                                    });
                                                });
                                            });
                                        }
                                        else {
                                            console.log("/api/products/family/" + tempB.Family + " = " + response.statusCode);
                                            res.render('404');
                                        }
                                    });
                                });
                            });
                        });
                    });
                }
                else {
                    console.log("/api/products/" + req.params.idP + " = " + response.statusCode);
                    res.render('404');
                }
            });
        }
        else {
            console.log("Não existe na BD externa   " + response.statusCode);
            res.render('404');
        }
    });

});

function addImagesToProducts(prods, tempB, comments, users, next) {
    if (prods.length > 0) {
        for (var j = 0; j < prods.length; j++) {
            if (tempB.Code == prods[j].idProdutoPrimavera) {
                tempB.Imagem = prods[j].imagem;
                j = prods.length;
            }
        }
    }
    else {
        for (var i = 0; i < tempB.length; i++) {
            tempB[i].Imagem = 'product.png';
        }
    }

    for (var i = 0; i < comments.length; i++) {
        for (var j = 0; j < users.length; j++) {
            if (comments[i].user == users[j].idUser)
                comments[i].username = users[j].username;
        }
    }
    if (typeof next == 'function') {
        next(prods, tempB, comments);
    }
}

function addImages(prods, relatedProducts, next) {
    for (var i = 0; i < relatedProducts.length; i++) {
        for (var j = 0; j < prods.length; j++) {
            if (relatedProducts[i].Code == prods[j].idProdutoPrimavera) {
                relatedProducts[i].Imagem = prods[j].imagem;
                j = prods.length;
            }
        }
    }

    for (var i = 0; i < relatedProducts.length; i++) {
        if (relatedProducts[i].Imagem == "")
            relatedProducts[i].Imagem = 'product.png';
    }

    if (typeof next == 'function') {
        next(relatedProducts);
    }
}

function approvedProducts(prods, appr, next) {
    var result = [];
    for (var i = 0; i < prods.length; i++) {
        for (var j = 0; j < appr.length; j++) {
            if (prods[i].Code == appr[j].idProdutoPrimavera)
                result.push(prods[i]);
        }
    }
    if (typeof next == 'function')
        next(result);
}

module.exports = router;