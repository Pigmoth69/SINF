var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var db = require('../database/database.js');
var config = require('../config/config.js');
var utils = require('./utils.js');

router.get('/', function (req, res) {
    if (req.session.user == undefined) { // ALTERAR
        res.redirect('/login');
    }
    else {
        console.log("else cart");
        db.getCart(req.session.user, function (cart) { //ALTERAR
            if (cart == 'no carrinho' || cart == 'sem merdas no carrinho') {
                res.render('cart1', { total: 0, cart: {}, relatedProducts: {} });
                //res.render('cart', { empty: "damn" });
            }
            else {
                db.getProducts(function (prods) {
                    var temp = cart;
                    //adicionar total
                    var total = 0;
                    // adicionar infos de cada produto
                    async.each(temp, function (item, callback) {
                        var prodURL = "http://localhost:" + config.PORT + "/api/products?id=" + item.idProdutoPrimavera;
                        console.log(prodURL);
                        request.get({ url: prodURL, proxy: config.PROXY }, function (error, response, body) {
                            console.log(error);
                            console.log(response.statusCode);
                            if (!error && response.statusCode == 200) {
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

                                var utype = req.session.typeUser;
                                if (utype == undefined) utype = 0;
                                item.Price = ((pvps[utype] * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((pvps[utype] * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));


                                item.Description = prod.Description;

                                item.Price = Math.round(item.Price * 100) / 100;
                                item.UnitPrice = Math.round(item.UnitPrice * 100) / 100;
                                total += item.Price;

                                item.Price = item.Price.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                                item.UnitPrice = item.UnitPrice.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                                callback(null);
                            }
                        });
                    }, function (err) {
                        total = Math.round(total * 100) / 100;
                        addImages(prods, temp, function (pro) {
                            temp = pro;

                            prodURL = "http://localhost:" + config.PORT + "/api/products/family/" + "Componentes"; //mudar
                            request.get({ url: prodURL, proxy: config.PROXY }, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var relatedProducts = JSON.parse(body);
                                    db.getApprovedProducts(function (appr) {
                                        approvedProducts(relatedProducts, appr, function (rp) {
                                            relatedProducts = rp;
                                            if (relatedProducts.length > 10)
                                                relatedProducts = relatedProducts.slice(0, 10);
                                            addImagesPri(prods, relatedProducts, function (r) {
                                                relatedProducts = r;
                                                total = total.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                                                utils.getCategoriesPrimavera(function (cats) {
                                                    res.render('cart1', { total: total, cart: temp, relatedProducts: relatedProducts, id: req.session.name, families: cats });
                                                });
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    });
                });
            }
        });
    }
});

router.get('/removeProduct/:idP', function (req, res) {
    if (req.session.user == undefined) {
        res.redirect('/login');
    }
    else {
        db.removeProductFromCartNo(req.params.idP, req.session.user, function (suc) {
            if (suc == 'sem problema') {
                res.redirect('/cart');
            }
            else {
                res.render('404');
            }
        });
    }
});

function addImages(prods, temp, next) {
    if (temp != null) {
        for (var i = 0; i < temp.length; i++) {
            for (var j = 0; j < prods.length; j++) {
                if (temp[i].idProdutoPrimavera == prods[j].idProdutoPrimavera) {
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
    else next(null);
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

function addImagesPri(prods, pri, next) {
    for (var i = 0; i < prods.length; i++) {
        for (var j = 0; j < pri.length; j++) {
            if (pri[j].Code == prods[i].idProdutoPrimavera) {
                pri[j].Imagem = prods[i].imagem;
            }
        }
    }
    for (var i = 0; i < pri.length; i++) {
        if (pri[i].Imagem == "")
            pri[i].Imagem = "product.png";
    }
    if (typeof next == 'function')
        next(pri);
}

module.exports = router;