var express = require('express');
var router = express.Router();

var fs = require('fs');
var request = require('request');
var pdf = require('html-pdf');
var path = require('path');
var mime = require('mime');

var user = "ALCAD";

router.get('/', function (req, res) {
    var orderURL = "http://localhost:49822/api/orders?client=" + user;
    request.get({ url: orderURL, proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var ordersJ = JSON.parse(body);
            res.render('order', { orders: ordersJ });
        }
        else {
            res.render('404');
        }
    });

});

router.get('/:page', function (req, res) {
    var pagina = req.params.page;
    /*
    var orderURL = "http://localhost:49822/api/orders?client=" + user;
    request.get({ url: orderURL, proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var ordersJ = JSON.parse(body);
            res.render('order', { orders: ordersJ });
        }
        else {
            res.render('404');
        }
    });
    */

});

router.get('/pdf/:idOrder', function (req, res) {
    var order = req.params.idOrder;

    var orderURL = "http://localhost:49822/api/orders/" + user + "?orderId=" + order;
    request.get({ url: orderURL, proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var orderInfo = JSON.parse(body);

            var PDFDocument = require('pdfkit');
            var doc = new PDFDocument;

            var yindex = 50;

            doc.image('public/images/logo.png', 150, yindex);

            yindex = 250;

            //id do documento
            doc.text("Order: ", 50, yindex);
            doc.text(order, 100, yindex);
            yindex+=30;
            doc.moveTo(50, yindex).lineTo(500, yindex).stroke();
            yindex+=20;
            //info do cliente
            doc.text("Client: ", 50, yindex);
            doc.text(orderInfo['Client']['CodClient'], 100, yindex);
            yindex+=20;
            doc.text("NIF: ", 50, yindex);
            doc.text(orderInfo['Client']['TaxpayNumber'], 100, yindex);
            yindex+=20;
            doc.text("Address: ", 50, yindex);
            doc.text(orderInfo['Client']['Adress'], 100, yindex);
            yindex+=30;
            doc.text("Date: ", 50, yindex);
            doc.text(orderInfo['Data'].substring(0, 10) + " " + orderInfo['Data'].substring(11, 19), 100, yindex);
            yindex+=30;
            doc.moveTo(50, yindex).lineTo(500, yindex).stroke();
            yindex+=20;

            //cabeçalho da tabela de produtos
            doc.text("Id", 50, yindex);
            doc.text("Name", 100, yindex);
            doc.text("Quantity", 340, yindex);
            doc.text("Price/Uni", 405, yindex);
            doc.text("Total", 470, yindex);
            
            var jump = 0;
            var valorTotal = 0;
            yindex+=40;
            //produtos
            for(var i = 0; i < orderInfo['LinhasDoc'].length; i++){ 
                jump = 20*i;
                doc.text(orderInfo['LinhasDoc'][i]['CodArtigo'], 50, yindex+jump);
                doc.text(orderInfo['LinhasDoc'][i]['DescArtigo'], 100, yindex+jump);
                doc.text(orderInfo['LinhasDoc'][i]['Quantidade'], 340, yindex+jump);
                doc.text(orderInfo['LinhasDoc'][i]['PrecoUnitario'], 405, yindex+jump);
                doc.text(orderInfo['LinhasDoc'][i]['TotalILiquido'], 470, yindex+jump);
                valorTotal += orderInfo['LinhasDoc'][i]['TotalILiquido'];
            }
            doc.text("Total: ", 405, yindex+jump+40);
            doc.text(orderInfo['TotalMerc'], 470, yindex+jump+40);

            doc.end();

            doc.pipe(res);
        }
        else {
            res.render('404');
        }
    });

});

module.exports = router;