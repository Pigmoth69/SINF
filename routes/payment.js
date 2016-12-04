var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var db = require('../database/database.js');

router.get('/', function (req, res) {
    var user = req.session.user;
    var userURL = "http://localhost:49822/api/Clients/" + user;

    request.get({ url: userURL, proxy: 'http://localhost:49822' }, function (error, response, userJ) {

        if (!error && response.statusCode == 200) {
            var userD = JSON.parse(userJ);
            console.log(userD);

            db.getCart(req.session.user, function (cart) {
                if (cart == 'no carrinho' || cart == 'sem merdas no carrinho') {
                    res.render('cart', { empty: "damn" });
                }
                else {
                    db.getProducts(function (prods) {
                        var temp = cart;

                        //adicionar total
                        var total = 0;
                        // adicionar infos de cada produto
                        async.each(temp, function (item, callback) {
                            var prodURL2 = "http://localhost:49822/api/products/" + item.idProdutoPrimavera;
                            request.get({ url: prodURL2, proxy: 'http://localhost:49822' }, function (error2, response2, body) {
                                if (!error2 && response2.statusCode == 200) {
                                    var prod = JSON.parse(body);
                                    item.Description = prod.Description;
                                    switch (req.session.typeUser) {
                                        case 1:
                                            item.Price = prod.Prices.PVP1 * item.quantidade;
                                            break;
                                        case 2:
                                            item.Price = prod.Prices.PVP2 * item.quantidade;
                                            break;
                                        case 3:
                                            item.Price = prod.Prices.PVP3 * item.quantidade;
                                            break;
                                        case 4:
                                            item.Price = prod.Prices.PVP4 * item.quantidade;
                                            break;
                                        case 5:
                                            item.Price = prod.Prices.PVP5 * item.quantidade;
                                            break;
                                        case 6:
                                            item.Price = prod.Prices.PVP6 * item.quantidade;
                                            break;
                                        default:
                                            item.Price = prod.Prices.PVP1 * item.quantidade;
                                            break;
                                    }
                                    total += item.Price;
                                    callback();
                                }
                            });
                        }, function (err) {
                            console.log(temp);
                            console.log("total: " + total);
                            res.render('payment', { userData: userD, total: total, cart: temp });
                        });
                    });
                }
            });
        }
        else {
            res.render('404');
        }
    });


});



module.exports = router;