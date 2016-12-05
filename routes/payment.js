var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var db = require('../database/database.js');
var config = require('../config/config.js');

var userD;

router.get('/', function(req, res) {
    var user = req.session.user;
    var userURL = "http://localhost:49822/api/Clients/" + user;

    request.get({ url: userURL, proxy: 'http://localhost:49822' }, function(error, response, userJ) {

        if (!error && response.statusCode == 200) {
            userD = JSON.parse(userJ);
            //console.log(userD);

            db.getCart(req.session.user, function(cart) {
                if (cart == 'no carrinho' || cart == 'sem merdas no carrinho') {
                    res.render('cart', { empty: "damn" });
                }
                else {
                    db.getProducts(function(prods) {
                        var temp = cart;

                        //adicionar total
                        var total = 0;
                        // adicionar infos de cada produto
                        async.each(temp, function(item, callback) {
                            var prodURL2 = "http://localhost:49822/api/products/" + item.idProdutoPrimavera;
                            request.get({ url: prodURL2, proxy: 'http://localhost:49822' }, function(error2, response2, body) {
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
                        }, function(err) {
                            //console.log(temp);
                            //console.log("total: " + total);
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

router.post('/confirm', function(req, res) {
    var urlQuer = "http://localhost:" + config.PORT + "/api/DocVenda";
    //console.log("req ----------------------");
    //console.log(req.params.Client.Address);
    var form = {};

    form.Client = {}
    form.Client.Adress = userD.Adress;
    form.Client.Adress2 = userD.Adress2;
    form.Client.ClientDiscount = userD.ClientDiscount;
    form.Client.ClientType = userD.ClientType;
    form.Client.CodClient = userD.CodClient;
    form.Client.Country = userD.Country;
    form.Client.Currency = userD.Currency;
    form.Client.District = userD.District;
    form.Client.Email = userD.Email;
    form.Client.ExpeditionWay = userD.ExpeditionWay;
    form.Client.FiscalName = userD.FiscalName;
    form.Client.Local = userD.Local;
    form.Client.NameClient = userD.NameClient;
    form.Client.PaymentType = userD.PaymentType;
    form.Client.PaymentWay = userD.PaymentWay;
    form.Client.Phone = userD.Phone;
    form.Client.Phone2 = userD.Phone2;
    form.Client.PostCode = userD.PostCode;
    form.Client.TaxpayNumber = userD.TaxpayNumber;

    var today = new Date().toJSON().slice(0, 19);
    form.Data = today;


    db.getCart(req.session.user, function(cart) {
        db.getProducts(function(prods) {
            var temp = cart;

            //adicionar total
            var total = 0;
            // adicionar infos de cada produto
            async.each(temp, function(item, callback) {
                var prodURL2 = "http://localhost:49822/api/products/" + item.idProdutoPrimavera;
                request.get({ url: prodURL2, proxy: 'http://localhost:49822' }, function(error2, response2, body) {
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
            }, function(err) {
                form.LinhasDoc = {};
                //console.log("temp.length = " + temp.length)
                for (var i = 0; i < temp.length; i++){
                    //console.log("temp[" + i + "] = " + temp[i].Description);
                    form.LinhasDoc[i] = {};
                    form.LinhasDoc[i].Armazem = '';
                    form.LinhasDoc[i].CodArtigo = temp[i].idProdutoPrimavera;
                    form.LinhasDoc[i].DescArtigo = temp[i].Description;
                    form.LinhasDoc[i].Desconto = '';
                    form.LinhasDoc[i].IdCabecDoc = '';
                    form.LinhasDoc[i].PrecoUnitario = temp[i].Price;
                    form.LinhasDoc[i].Quantidade = temp[i].quantidade;
                    form.LinhasDoc[i].TotalILiquido = parseInt(temp[i].quantidade) * parseInt(temp[i].Price);
                    form.LinhasDoc[i].TotalLiquido = 'é necessario calcular o liquido aqui';
                    form.LinhasDoc[i].Unidade = 'UN';
                }

                form.NumDoc = '';
                form.Serie = '';
                form.TotalMerc = total;
                form.id = '';

                request.post({ url: urlQuer, proxy: config.PROXY, headers: [{ 'Content-Type': 'application/json' }], json: form}, function (error, response, body) {
                    console.log("error");
                    console.log(error);
                    console.log("response");
                    console.log(response);
                    console.log("body");
                    console.log(body);
                });

                //console.log(form);
            });
        });
    });

});



module.exports = router;