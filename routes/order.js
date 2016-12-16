var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var utils = require('./utils.js');

var fs = require('fs');
var request = require('request');
var pdf = require('html-pdf');
var path = require('path');
var mime = require('mime');


router.get('/', function (req, res) {
    res.redirect('1/10');
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
                    doc.text(orderInfo['LinhasDoc'][i]['PrecoUnitario'], 405, yindex + jump);
                    doc.text(orderInfo['LinhasDoc'][i]['TotalILiquido'], 470, yindex + jump);
                    valorTotal += orderInfo['LinhasDoc'][i]['TotalILiquido'];
                }
                doc.text("Total: ", 405, yindex + jump + 40);
                doc.text(orderInfo['TotalMerc'], 470, yindex + jump + 40);

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
                            "Processing order",
                            "Order Processed",
                            "Order Shiped",
                            "Order Shiped2"
                        ];

                        for (var i = 0; i < ordersJ.length; i++) {
                            ordersJ[i].Data = ordersJ[i].Data.replace("T", " ");
                            ordersJ[i].TotalMerc = ordersJ[i].TotalMerc.toLocaleString("es-ES", { minimumFractionDigits: 2 });
                            //console.log(ordersJ[i]);
                            var stat = ordersJ[i].Status;
                            ordersJ[i].Status = statusEnc[stat];

                        }

                        if (page > 1)
                            pagei--;

                        if (page < totalP)
                            pagel = parseInt(page) + 1;

                        utils.getCategoriesPrimavera(function (cats) {
                            res.render('order', { orders: ordersJ, totalPage: totalP, page: req.params.page, pageA: pagel, pageB: pagei, id: req.session.user, families: cats, perPage: numPerPage });
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