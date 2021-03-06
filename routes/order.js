var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var utils = require('./utils.js');

var fs = require('fs');
var request = require('request');
var pdf = require('html-pdf');
var path = require('path');
var mime = require('mime');
var db = require('../database/database.js');
var async = require('async');


router.get('/', function (req, res) {
    res.redirect('/order/1/10');
});

router.get('/invoice/:id', function (req, res, next) {
    var orderURL = "http://localhost:" + config.PORT + "/api/orders/pdf?orderId=" + req.params.id;
    res.redirect(orderURL);
    /*
    request.get({ url: orderURL, proxy: config.PROXY }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            fs.readFile('C:\SINF' +  req.params.id', [encoding], [callback]);
        }
        else {
            res.render('404');
        }
    });
    */
});

router.get('/pdf/:idO', function (req, res) {

    if (req.session.user == undefined) { // ALTERAR
        res.redirect('/login');
    }
    else {
        console.log("******** ORDER INFO *********");

        var order = req.params.idO;
        console.log(order);
        var user = req.session.user;
        console.log(user);

        var orderURL = "http://localhost:" + config.PORT + "/api/orders/" + user + "?orderId=" + order;
        console.log(orderURL);
        request.get({ url: orderURL, proxy: config.PROXY }, function (error, response, body) {
            console.log("******** ORDER INFO *********");
            if (!error && response.statusCode == 200) {
                var orderInfo = JSON.parse(body);
                console.log("******** ORDER INFO *********");
                console.log(orderInfo);

                var PDFDocument = require('pdfkit');
                var doc = new PDFDocument;

                var yindex = 50;

                doc.image('public/images/logo.png', 150, yindex);

                yindex = 250;

                //id do documento
                doc.text("Order: ", 50, yindex);
                doc.text(order, 100, yindex);
                yindex += 30;
                doc.moveTo(50, yindex).lineTo(500, yindex).stroke();
                yindex += 20;
                //info do cliente
                doc.text("Client: ", 50, yindex);
                doc.text(orderInfo['Client']['CodClient'], 100, yindex);
                yindex += 20;
                doc.text("NIF: ", 50, yindex);
                doc.text(orderInfo['Client']['TaxpayNumber'], 100, yindex);
                yindex += 20;
                doc.text("Address: ", 50, yindex);
                doc.text(orderInfo['Client']['Address'], 100, yindex);
                yindex += 30;
                doc.text("Date: ", 50, yindex);
                doc.text(orderInfo['Data'].substring(0, 10) + " " + orderInfo['Data'].substring(11, 19), 100, yindex);
                yindex += 30;
                doc.moveTo(50, yindex).lineTo(500, yindex).stroke();
                yindex += 20;

                //cabeçalho da tabela de produtos
                doc.text("Id", 50, yindex);
                doc.text("Name", 100, yindex);
                doc.text("Quantity", 340, yindex);
                doc.text("Price/Uni", 405, yindex);
                doc.text("Total", 470, yindex);

                var jump = 0;
                var valorTotal = 0;
                yindex += 40;
                //produtos
                for (var i = 0; i < orderInfo['LinhasDoc'].length; i++) {
                    jump = 20 * i;
                    doc.text(orderInfo['LinhasDoc'][i]['CodArtigo'], 50, yindex + jump);
                    doc.text(orderInfo['LinhasDoc'][i]['DescArtigo'], 100, yindex + jump);
                    doc.text(orderInfo['LinhasDoc'][i]['Quantidade'], 340, yindex + jump);
                    doc.text(orderInfo['LinhasDoc'][i]['TotalPrecoArtigo'] / orderInfo['LinhasDoc'][i]['Quantidade'], 405, yindex + jump);
                    doc.text(orderInfo['LinhasDoc'][i]['TotalPrecoArtigo'], 470, yindex + jump);
                    valorTotal += orderInfo['LinhasDoc'][i]['TotalPrecoArtigo'];
                }
                doc.text("Total: ", 405, yindex + jump + 40);
                doc.text(orderInfo['TotalRealMerc'], 470, yindex + jump + 40);

                doc.end();

                doc.pipe(res);
            }
            else {
                console.log("PEIDO");
                res.render('404');
            }
        });
    }
});

router.get('/:page/:perpage', function (req, res) {
    if (req.session.user == undefined) { // ALTERAR
        res.redirect('/login');
    }
    else {
        var user = req.session.user;
        var numPerPage = req.params.perpage;
        //console.log(req.session);
        var orderURL = "http://localhost:" + config.PORT + "/api/orders/" + user + "?page=" + req.params.page + "&numperpage=" + numPerPage;
        var orderURL2 = "http://localhost:" + config.PORT + "/api/orders/total?client=" + user;
        request.get({ url: orderURL, proxy: config.PROXY }, function (error, response, orders) {

            if (!error && response.statusCode == 200) {
                console.log(user);
                request.get({ url: orderURL2, proxy: config.PROXY }, function (error, response, total) {
                    if (!error && response.statusCode == 200) {
                        var ordersJ = JSON.parse(orders);
                        var totalJ = JSON.parse(total);
                        var totalP = Math.ceil(totalJ / numPerPage);
                        var page = req.params.page;
                        var pagei = page;
                        var pagel = page;

                        var statusEnc = [
                            "Order Placed, waiting payment acceptance",
                            "Order Accepted, waiting for processing",
                            "Processing order",
                            "Order Processed",
                            "Order Shipped",
                            "Order Shipped"
                        ];
                        async.each(ordersJ, function (item, callback) {
                            item.Data = item.Data.replace("T", " ");
                            item.TotalMerc = item.TotalMerc.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                            item.TotalRealMerc = item.TotalRealMerc.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                            //console.log(ordersJ[i]);
                            var stat = item.Status;
                            if (stat > 2) {
                                stat++;
                                item.Status = statusEnc[stat];
                                item.hasFact = true;

                                callback();
                            }
                            else if (stat == 0) {
                                db.getOrder(item.id, function (pago) {
                                    if (pago[0].pago == 0) {
                                        stat = 0;
                                    }
                                    else {
                                        stat = 1;
                                    }
                                    item.Status = statusEnc[stat];
                                    console.log(item.Status);
                                    if (page > 1)
                                        pagei--;

                                    if (page < totalP)
                                        pagel = parseInt(page) + 1;

                                    callback();
                                });
                            }
                            else {
                                stat++;
                                item.Status = statusEnc[stat];
                                callback();
                            }
                        }, function (err) {
                            utils.getCategoriesPrimavera(function (cats) {
                                var total = req.session.totalCart.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                                console.log(ordersJ);
                                res.render('order', { orders: ordersJ, totalPage: totalP, page: req.params.page, pageA: pagel, pageB: pagei, id: req.session.user, families: cats, perPage: numPerPage, total: total });
                            });
                        });
                    }
                    else {
                        res.render('404');
                    }
                });
            }
            else {
                res.render('404');
            }
        });
        var pagina = req.params.page;

    }

});
module.exports = router;