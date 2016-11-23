var express = require('express');
var router = express.Router();

var fs = require('fs');
var request = require('request');
var pdf = require('html-pdf');
var path = require('path');
var mime = require('mime');


router.get('/', function (req, res) {
    var orderURL = "http://localhost:49822/api/orders?client=ALCAD";
    request.get({ url: orderURL, proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var ordersJ = JSON.parse(body);
            res.render('order', { orders: ordersJ });
        }
        else {
            res.render('404');
        }
    });

    //res.render('order');
});

router.get('/pdf/:idOrder', function (req, res) {

    var html = '<div id="headerpdf" style="inline-block"><img id="logoPdf" src="../public/images/logo.png" alt="logo"><h1>Order document</h1></div>';
    //var html = "12343252342";
    //var html = '<h1>Cenas</h1>'; 

    var filename = req.params.idOrder + '.pdf';
    
    pdf.create(html).toFile('pdfs/' + filename, function (err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
/*
    var filename = path.basename('pdfs/' + filename);
    var mimetype = mime.lookup('pdfs/' + filename);

    res.setHeader('Content-disposition', 'attachment; filename=' + 'pdfs/' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream('pdfs/' + filename);
    filestream.pipe(res);
*/


    /*
    var orderURL = "http://localhost:49822/api/order?id=" + req.params.idOrder; 
    request.get({url : orderURL, proxy : 'http://localhost:49822'}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            console.log(temp);

            //criação do pdf
            var doc = new pdf;
            doc.pipe(fs.createWriteStream(req.params.idOrder));
            doc.font('Times-Roman')
                .fontSize(30)
                .text('Order' + req.params.idOrder, 100, 100)
        }
        else {
            res.render('404');
        }
    });
    */
});

module.exports = router;