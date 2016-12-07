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
                        switch (req.session.typeUser) {
                            case 1:
                                iva = tempB.Prices.PVP1 * tempB.IVA * 0.01;
                                if (req.session.user != undefined)
                                    res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments, id: req.session.user });
                                else res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments });
                                break;
                            case 2:
                                iva = tempB.Prices.PVP2 * tempB.IVA * 0.01;
                                if (req.session.user != undefined)
                                    res.render('product', { product: tempB, iva: iva, typeTwo: req.session.typeUser, stk: stk, comments: comments, id: req.session.user });
                                else res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments });
                                break;
                            case 3:
                                iva = tempB.Prices.PVP3 * tempB.IVA * 0.01;
                                if (req.session.user != undefined)
                                    res.render('product', { product: tempB, iva: iva, typeThree: req.session.typeUser, stk: stk, comments: comments, id: req.session.user });
                                else res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments });
                                break;
                            case 4:
                                iva = tempB.Prices.PVP4 * tempB.IVA * 0.01;
                                if (req.session.user != undefined)
                                    res.render('product', { product: tempB, iva: iva, typeFour: req.session.typeUser, stk: stk, comments: comments, id: req.session.user });
                                else res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments });
                                break;
                            case 5:
                                iva = tempB.Prices.PVP5 * tempB.IVA * 0.01;
                                if (req.session.user != undefined)
                                    res.render('product', { product: tempB, iva: iva, typeFive: req.session.typeUser, stk: stk, comments: comments, id: req.session.user });
                                else res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments });
                                break;
                            case 6:
                                iva = tempB.Prices.PVP6 * tempB.IVA * 0.01;
                                if (req.session.user != undefined)
                                    res.render('product', { product: tempB, iva: iva, typeSix: req.session.typeUser, stk: stk, comments: comments, id: req.session.user });
                                else res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments });
                                break;
                            default:
                                iva = tempB.Prices.PVP1 * tempB.IVA * 0.01;
                                if (req.session.user != undefined)
                                    res.render('product', { product: tempB, iva: iva, typeOne: '1', stk: stk, comments: comments, id: req.session.user });
                                else res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments });
                                break;
                        }
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
});

module.exports = router;