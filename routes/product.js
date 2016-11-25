var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../database/database.js');

router.get('/', function (req, res) {
    res.render('product');
});

router.get('/:idP', function (req, res) {
    var prodURL = "http://localhost:49822/api/products/" + req.params.idP;

    request.get({ url: prodURL, proxy: 'http://localhost:49822' }, function (error, response, body) {
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
                var iva;
                switch (req.session.typeUser) {
                    case 1:
                        iva = tempB.Prices.PVP1 * tempB.IVA * 0.01;
                        res.render('product', { product: tempB, iva: iva, typeOne: req.session.typeUser });
                        break;
                    case 2:
                        iva = tempB.Prices.PVP2 * tempB.IVA * 0.01;
                        res.render('product', { product: tempB, iva: iva, typeTwo: req.session.typeUser });
                        break;
                    case 3:
                        iva = tempB.Prices.PVP3 * tempB.IVA * 0.01;
                        res.render('product', { product: tempB, iva: iva, typeThree: req.session.typeUser });
                        break;
                    case 4:
                        iva = tempB.Prices.PVP4 * tempB.IVA * 0.01;
                        res.render('product', { product: tempB, iva: iva, typeFour: req.session.typeUser });
                        break;
                    case 5:
                        iva = tempB.Prices.PVP5 * tempB.IVA * 0.01;
                        res.render('product', { product: tempB, iva: iva, typeFive: req.session.typeUser });
                        break;
                    case 6:
                        iva = tempB.Prices.PVP6 * tempB.IVA * 0.01;
                        res.render('product', { product: tempB, iva: iva, typeSix: req.session.typeUser });
                        break;
                    default:
                        iva = tempB.Prices.PVP1 * tempB.IVA * 0.01;
                        res.render('product', { product: tempB, iva: iva, typeOne: '1' });
                        break;
                }
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