var express = require('express');
var router = express.Router();

var request = require('request');
var async = require('async');
var db = require('../database/database.js');
var config = require('../config/config.js');

var userD;

router.get('/', function (req, res) {
    var user = req.session.user;
    var userURL = "http://localhost:" + config.PORT + "/api/clients?id=" + user;

    request.get({ url: userURL, proxy: config.PROXY }, function (error, response, userJ) {

        if (!error && response.statusCode == 200) {
            userD = JSON.parse(userJ);
            //console.log(userD);
            var paymentsURL = "http://localhost:49822/api/utils/paymenttypes";
            var paymentsWURL = "http://localhost:49822/api/utils/paymentways";
            var expeditionURL = "http://localhost:49822/api/utils/expeditionway";
            request.get({ url: paymentsURL, proxy: config.PROXY }, function (error3, response3, paymenttypesB) {
                request.get({ url: paymentsWURL, proxy: config.PROXY }, function (error4, response4, paymentwaysB) {
                    request.get({ url: expeditionURL, proxy: config.PROXY }, function (error5, response5, expeditionB) {
                        var paymentT = JSON.parse(paymenttypesB);
                        var paymentW = JSON.parse(paymentwaysB);
                        var expeditionW = JSON.parse(expeditionB);
                        var p1, p2, e1;
                        //console.log(paymentW);
                        /*
                        for (var i = 0; i < paymentT.length; i++) {
                            if (paymentT[i].PaymentTypeCode == userD.PaymentType) {
                                p1 = paymentT[i].PaymentTypeDescription;
                            }
                        }
                        for (var i = 0; i < paymentW.length; i++) {
                            if (paymentW[i].PaymentWayCode == userD.PaymentWay) {
                                p2 = paymentW[i].PaymentWayDescription;
                            }
                        }
                        for (var i = 0; i < expeditionW.length; i++) {
                            if (expeditionW[i].ExpeditionCode == userD.ExpeditionWay) {
                                e1 = expeditionW[i].ExpeditionDescription;
                            }
                        }
                        */

                        //console.log(p1);
                        //console.log(p2);
                        //console.log(e1);

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
                                        request.get({ url: prodURL2, proxy: config.PROXY }, function (error2, response2, body) {
                                            if (!error2 && response2.statusCode == 200) {
                                                var prod = JSON.parse(body);
                                                item.Description = prod.Description;
                                                switch (req.session.typeUser) {
                                                    case 1:
                                                        item.Price = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                                        item.UnitPrice = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                        break;
                                                    case 2:
                                                        item.Price = ((prod.Prices.PVP2 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                                        item.UnitPrice = ((prod.Prices.PVP2 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                        break;
                                                    case 3:
                                                        item.Price = ((prod.Prices.PVP3 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                                        item.UnitPrice = ((prod.Prices.PVP3 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                        break;
                                                    case 4:
                                                        item.Price = ((prod.Prices.PVP4 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                                        item.UnitPrice = ((prod.Prices.PVP4 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                        break;
                                                    case 5:
                                                        item.Price = ((prod.Prices.PVP5 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                                        item.UnitPrice = ((prod.Prices.PVP5 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                        break;
                                                    case 6:
                                                        item.Price = ((prod.Prices.PVP6 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                                        item.UnitPrice = ((prod.Prices.PVP6 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                        break;
                                                    default:
                                                        item.Price = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                                        item.UnitPrice = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                                        break;
                                                }
                                                item.Price = Math.round(item.Price * 100) / 100;
                                                item.UnitPrice = Math.round(item.UnitPrice * 100) / 100;
                                                total += item.Price;


                                                item.Price = item.Price.toLocaleString("es-ES", {minimumFractionDigits: 2});
                                                item.UnitPrice = item.UnitPrice.toLocaleString("es-ES", {minimumFractionDigits: 2});
                                                
                                                
                                                callback();
                                            }
                                        });
                                    }, function (err) {
                                        addImages(prods, temp, function (pro) {
                                            total = total.toLocaleString("es-ES", {minimumFractionDigits: 2});

                                            temp = pro;
                                            //console.log(temp);
                                            //console.log("total: " + total);
                                            //onsole.log(userD);
                                            console.log(temp);
                                            //console.log(paymentT);
                                            res.render('payment', { userData: userD, total: total, cart: temp, payType: paymentT, payWay: paymentW, expWay: expeditionW });
                                        });
                                    });
                                });
                            }
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

router.post('/confirm', function (req, res) {
    var urlQuer = "http://localhost:" + config.PORT + "/api/DocVenda";
    //console.log("req ----------------------");
    //console.log(req.params.Client.Address);




    db.getCart(req.session.user, function (cart) {
        db.getProducts(function (prods) {
            var temp = cart;

            //adicionar total
            var prodA = {};
            var j = 0;
            var total = 0;
            // adicionar infos de cada produto
            async.each(temp, function (item, callback) {
                var prodURL2 = "http://localhost:49822/api/products/" + item.idProdutoPrimavera;
                request.get({ url: prodURL2, proxy: config.PROXY }, function (error2, response2, body) {
                    if (!error2 && response2.statusCode == 200) {
                        var prod = JSON.parse(body);
                        item.Description = prod.Description;
                        switch (req.session.typeUser) {
                            case 1:
                                item.Price = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                break;
                            case 2:
                                item.Price = ((prod.Prices.PVP2 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((prod.Prices.PVP2 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                break;
                            case 3:
                                item.Price = ((prod.Prices.PVP3 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((prod.Prices.PVP3 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                break;
                            case 4:
                                item.Price = ((prod.Prices.PVP4 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((prod.Prices.PVP4 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                break;
                            case 5:
                                item.Price = ((prod.Prices.PVP5 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((prod.Prices.PVP5 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                break;
                            case 6:
                                item.Price = ((prod.Prices.PVP6 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((prod.Prices.PVP6 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                break;
                            default:
                                item.Price = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1)) * item.quantidade;
                                item.UnitPrice = ((prod.Prices.PVP1 * (1 - req.session.discount * 0.01) * (1 - prod.Discount * 0.01)) * (prod.IVA * 0.01 + 1));
                                break;
                        }
                        item.Price = Math.round(item.Price * 100) / 100;
                        item.UnitPrice = Math.round(item.UnitPrice * 100) / 100;
                        total += item.Price;
                        callback();
                    }
                });
            }, function (err) {
                addImages(prods, temp, function (pro) {
                    temp = pro;
                    //temp é o carrinho (bd) 
                    //console.log("temp.length = " + temp.length)
                    //console.log(prodA); prodA são os produtos na loja (bd)
                    var form = fillOrder(total, '2016', temp, prodA)
                    console.log(form);
                    /*
                    request.post({ url: urlQuer, proxy: config.PROXY, headers: [{ 'Content-Type': 'application/json' }], json: form }, function (error, response, body) {
                        if (!error && response.statusCode == 201) {
                            //console.log(error);
                            //console.log(response.statusCode);
                            //console.log(body);
                            res.send('/');
                        }
                    });
                    */


                    res.render('404');
                    //console.log(form);
                });
            });
        });
    });


});

function addImages(prods, temp, next) {
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

function fillOrder(total, serie, carrinho, loja) {

    var form = {};
    form.id = '';

    form.Client = {}
    form.Client.Address = userD.Address;
    form.Client.Address2 = userD.Address2;
    form.Client.CodClient = userD.CodClient;
    form.Client.NameClient = userD.NameClient;
    form.Client.FiscalName = userD.FiscalName;
    form.Client.TaxpayNumber = userD.TaxpayNumber;
    form.Client.Email = userD.Email;
    form.Client.PostCode = userD.PostCode;
    form.Client.Local = userD.Local;
    form.Client.Phone = userD.Phone;
    form.Client.Phone2 = userD.Phone2;
    form.Client.Country = userD.Country;
    form.Client.ClientDiscount = userD.ClientDiscount;
    form.Client.PaymentType = userD.PaymentType;
    form.Client.PaymentWay = userD.PaymentWay;
    form.Client.ClientType = userD.ClientType;
    form.Client.District = userD.District;
    form.Client.ExpeditionWay = userD.ExpeditionWay;
    form.Client.Currency = userD.Currency;

    var today = new Date().toJSON().slice(0, 19);
    form.NumDoc = '';
    form.Data = today;
    //ter em atenção à diferença entre totalMerc e totalReal
    form.TotalMerc = total;
    //não sei o que devo usar nisto, o default era '2016'
    form.Serie = serie;
    form.TotalRealMerc = 'isto é o total sem IVA?';

    form.LinhasDoc = [];

    for (var i = 0; i < carrinho.length; i++) {
        //console.log("temp[" + i + "] = " + temp[i].Description);
        form.LinhasDoc[i] = {};

        form.LinhasDoc[i].CodArtigo = carrinho[i].idProdutoPrimavera;
        form.LinhasDoc[i].DescArtigo = carrinho[i].Description;
        form.LinhasDoc[i].TotalDescArtigo = '';
        form.LinhasDoc[i].TotalDescontoCliente = '';
        form.LinhasDoc[i].IvaTotal = loja[i]['IVA'];
        form.LinhasDoc[i].IdCabecDoc = '';
        form.LinhasDoc[i].Quantidade = carrinho[i].quantidade;
        form.LinhasDoc[i].Unidade = '';
        form.LinhasDoc[i].Desconto = loja[i]['Discount'];
        form.LinhasDoc[i].PrecoUnitario = carrinho[i].Price;
        form.LinhasDoc[i].TotalILiquido = '';
        form.LinhasDoc[i].TotalLiquido = '';
        form.LinhasDoc[i].TotalPrecoArtigo = '';
        form.LinhasDoc[i].Armazem = '';
    }

    return form;
}

module.exports = router;