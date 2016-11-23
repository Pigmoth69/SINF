var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res) {
    res.render('product');
});

router.get('/:idP', function(req, res) {
    var prodURL = "http://localhost:49822/api/products/" + req.params.idP;

    request.get({url : prodURL, proxy : 'http://localhost:49822'}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);
            //console.log(temp);
            var iva = temp.Prices.PVP1 * temp.IVA * 0.01;
            res.render('product', {product : temp, iva :  iva});
        }
        else {
            console.log(error);
            console.log(response);
            res.render('404');
        }
    });
});

module.exports = router;