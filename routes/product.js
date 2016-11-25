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
            switch (req.session.typeUser) {
                case '1':
                res.render('product', {product : temp, iva :  iva, typeOne : req.session.typeUser});
                break;
                case '2':
                res.render('product', {product : temp, iva :  iva, typeTwo : req.session.typeUser});
                break;
                case '3':
                res.render('product', {product : temp, iva :  iva, typeThree : req.session.typeUser});
                break;
                case '4':
                res.render('product', {product : temp, iva :  iva, typeFour : req.session.typeUser});
                break;
                case '5':
                res.render('product', {product : temp, iva :  iva, typeFive : req.session.typeUser});
                break;
                case '6':
                res.render('product', {product : temp, iva :  iva, typeSix : req.session.typeUser});
                break;
                default:
                res.render('product', {product : temp, iva :  iva, typeOne : '1'});
                break;
            }
            
        }
        else {
            console.log(error);
            console.log(response);
            res.render('404');
        }
    });
});

module.exports = router;