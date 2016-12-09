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
                                                            addImages(prods, relatedProducts, function (rp1) {
                                                                relatedProducts = rp1;
                                                                var price_no = Math.round(tempB.Prices.PVP1 * (tempB.IVA * 0.01 + 1) * 100) / 100;
                                                                switch (req.session.typeUser) {
                                                                    case 1:
                                                                        price = tempB.Prices.PVP1 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        price = Math.round(price * 100) / 100;
                                                                        iva = (tempB.Prices.PVP1 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                        iva = Math.round(iva * 100) / 100;
                                                                        res.render('product1', {
                                                                            product: tempB, iva: iva, typeOne: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price,
                                                                            price_no: price_no, disc: cl.ClientDiscount, relatedProducts: relatedProducts
                                                                        });
                                                                        break;
                                                                    case 2:
                                                                        price = tempB.Prices.PVP2 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        price = Math.round(price * 100) / 100;
                                                                        iva = (tempB.Prices.PVP2 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                        iva = Math.round(iva * 100) / 100;
                                                                        res.render('product1', {
                                                                            product: tempB, iva: iva, typeTwo: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price,
                                                                            price_no: price_no, disc: cl.ClientDiscount, relatedProducts: relatedProducts
                                                                        });
                                                                        break;
                                                                    case 3:
                                                                        price = tempB.Prices.PVP3 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        price = Math.round(price * 100) / 100;
                                                                        iva = (tempB.Prices.PVP3 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                        iva = Math.round(iva * 100) / 100;
                                                                        res.render('product1', {
                                                                            product: tempB, iva: iva, typeThree: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price,
                                                                            price_no: price_no, disc: cl.ClientDiscount, relatedProducts: relatedProducts
                                                                        });
                                                                        break;
                                                                    case 4:
                                                                        price = tempB.Prices.PVP4 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        price = Math.round(price * 100) / 100;
                                                                        iva = (tempB.Prices.PVP4 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                        iva = Math.round(iva * 100) / 100;
                                                                        res.render('product1', {
                                                                            product: tempB, iva: iva, typeFour: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price,
                                                                            price_no: price_no, disc: cl.ClientDiscount, relatedProducts: relatedProducts
                                                                        });
                                                                        break;
                                                                    case 5:
                                                                        price = tempB.Prices.PVP5 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        price = Math.round(price * 100) / 100;
                                                                        iva = (tempB.Prices.PVP5 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                        iva = Math.round(iva * 100) / 100;
                                                                        res.render('product1', {
                                                                            product: tempB, iva: iva, typeFive: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price,
                                                                            price_no: price_no, disc: cl.ClientDiscount, relatedProducts: relatedProducts
                                                                        });
                                                                        break;
                                                                    case 6:
                                                                        price = tempB.Prices.PVP6 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01) * (tempB.IVA * 0.01 + 1);
                                                                        price = Math.round(price * 100) / 100;
                                                                        iva = (tempB.Prices.PVP6 * (1 - cl.ClientDiscount * 0.01) * (1 - tempB.Discount * 0.01)) * (tempB.IVA * 0.01);
                                                                        iva = Math.round(iva * 100) / 100;
                                                                        res.render('product1', {
                                                                            product: tempB, iva: iva, typeSix: req.session.typeUser, stk: stk, comments: comments, id: req.session.user, price: price,
                                                                            price_no: price_no, disc: cl.ClientDiscount, relatedProducts: relatedProducts
                                                                        });
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
                                                                        price = Math.round(price * 100) / 100;
                                                                        iva = Math.round(iva * 100) / 100;
                                                                        if (req.session.user != undefined)
                                                                            res.render('product1', {
                                                                                product: tempB, iva: iva, typeOne: '1', stk: stk, comments: comments, id: req.session.user, price: price, price_no: price_no,
                                                                                disc: cl.ClientDiscount, relatedProducts: relatedProducts
                                                                            });
                                                                        else res.render('product1', {
                                                                            product: tempB, iva: iva, typeOne: 'teste', stk: stk, comments: comments, price: price, price_no: price_no, disc: 0, relatedProducts: relatedProducts
                                                                        });
                                                                        break;
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            console.log(response.statusCode);
                                                            res.render('404');
                                                        }
                                                    });
                                                });
                                            });
                                        }
                                        else {
                                            console.log(response.statusCode);
                                            res.render('404');
                                        }
                                    });
                                });
                            });
                        });
                    });
                }
                else {
                    console.log(response.statusCode);
                    res.render('404');
                }
            });
        }
        else {
            console.log(response.statusCode);
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