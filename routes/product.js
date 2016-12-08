var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../database/database.js');
var config = require('../config/config.js');

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
    db.getProductByID(req.params.idP, function (rows) {
        if (rows.length > 0) { //aprovado
            var prodURL = "http://localhost:" + config.PORT + "/api/products/" + req.params.idP;

            request.get({ url: prodURL, proxy: config.PROXY }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var tempB = JSON.parse(body);
                    db.getProducts(function (prods) {
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
                        db.getCommentsOnProduct(tempB.Code, function (comments) {
                            db.getUsers(function (users) {
                                for (var i = 0; i < comments.length; i++) {
                                    for (var j = 0; j < users.length; j++) {
                                        if (comments[i].user == users[j].idUser)
                                            comments[i].username = users[j].username;
                                    }
                                }
                                var stk;
                                if (tempB.STKActual < 0)
                                    stk = "no";
                                else stk = tempB.STKActual + 0;
                                tempB.stk = stk;
                                var iva;
                                var price;
                                if (req.session.user != undefined)
                                    prodURL = "http://localhost:" + config.PORT + "/api/clients?id=" + req.session.user;
                                else prodURL = "http://localhost:" + config.PORT + "/api/clients?id=ALCAD";

                                request.get({ url: prodURL, proxy: config.PROXY }, function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        var cl = JSON.parse(body);
                                        switch (req.session.typeUser) {
                                            case 1:
                                                if (req.session.user == undefined) {
                                                    price = tempB.Prices.PVP1 * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP1 * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                else {
                                                    price = tempB.Prices.PVP1 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP1 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                if (req.session.user != undefined)
                                                    res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price });
                                                else res.render('product', { product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price });
                                                break;
                                            case 2:
                                                if (req.session.user == undefined) {
                                                    price = tempB.Prices.PVP2 * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP2 * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                else {
                                                    price = tempB.Prices.PVP2 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP2 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                if (req.session.user != undefined)
                                                    res.render('product', { product: tempB, iva: iva, typeTwo: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price });
                                                else res.render('product', { product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price });
                                                break;
                                            case 3:
                                                if (req.session.user == undefined) {
                                                    price = tempB.Prices.PVP3 * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP3 * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                else {
                                                    price = tempB.Prices.PVP3 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP3 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                if (req.session.user != undefined)
                                                    res.render('product', { product: tempB, iva: iva, typeThree: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price });
                                                else res.render('product', { product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price });
                                                break;
                                            case 4:
                                                if (req.session.user == undefined) {
                                                    price = tempB.Prices.PVP4 * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP4 * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                else {
                                                    price = tempB.Prices.PVP4 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP4 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                if (req.session.user != undefined)
                                                    res.render('product', { product: tempB, iva: iva, typeFour: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price });
                                                else res.render('product', { product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price });
                                                break;
                                            case 5:
                                                if (req.session.user == undefined) {
                                                    price = tempB.Prices.PVP5 * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP5 * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                else {
                                                    price = tempB.Prices.PVP5 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP5 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                if (req.session.user != undefined)
                                                    res.render('product', { product: tempB, iva: iva, typeFive: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price });
                                                else res.render('product', { product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price });
                                                break;
                                            case 6:
                                                if (req.session.user == undefined) {
                                                    price = tempB.Prices.PVP6 * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP6 * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                else {
                                                    console.log(tempB);
                                                    console.log(cl);
                                                    price = tempB.Prices.PVP6 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP6 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                if (req.session.user != undefined)
                                                    res.render('product', { product: tempB, iva: iva, typeSix: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price });
                                                else res.render('product', { product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price });
                                                break;
                                            default:
                                                if (req.session.user == undefined) {
                                                    price = tempB.Prices.PVP1 * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP1 * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                else {
                                                    price = tempB.Prices.PVP1 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                    iva = (tempB.Prices.PVP1 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                }
                                                if (req.session.user != undefined)
                                                    res.render('product', { product: tempB, iva: iva, typeOne: '1', stk: stk, comments: comments, id: req.session.user, price: price });
                                                else res.render('product', { product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price });
                                                break;
                                        }
                                    }
                                });
                            });
                        });
                    });
                }
                else {
                    console.log(error);
                    console.log(response);
                    res.render('404');
                }
            });
        }
        else {
            res.render('404');
        }
    });

});

module.exports = router;