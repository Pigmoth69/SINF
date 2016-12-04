var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var db = require('../database/database.js');

router.get('/', function (req, res) {
    if (req.session.user == undefined)
        res.redirect('/login');
    else {
        db.getCart(req.session.user, function (cart) {
            if (cart == 'no carrinho' || cart == 'sem merdas no carrinho') {
                res.render('cart', { empty: "damn" });
            }
            else {
                db.getProducts(function (prods) {
                    var temp = cart;

                    // adicionar imagens
                    if (prods != null) {
                        for (var i = 0; i < temp.length; i++) {
                            for (var j = 0; j < prods.length; j++) {
                                if (temp[i].idProdutoPrimavera == prods[j].idProdutoPrimavera) {
                                    temp[i].Imagem = prods[j].imagem;
                                    j = prods.length;
                                }
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < temp.length; i++) {
                            temp[i].Imagem = 'product.png';
                        }
                    }

                    //adicionar total
                    var total = 0;
                    // adicionar infos de cada produto
                    async.each(temp, function (item, callback) {
                        var prodURL = "http://localhost:49822/api/products/" + item.idProdutoPrimavera;
                        request.get({ url: prodURL, proxy: 'http://localhost:49822' }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
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
                        res.render('cart', {total : total, cart : temp});
                    });
                });
            }
        });
    }
});

function aux() {

}


module.exports = router;