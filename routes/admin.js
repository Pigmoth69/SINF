var express = require('express');
var router = express.Router();
var db = require('../database/database.js');
var config = require('../config/config.js');
var request = require('request');

router.get('/', function (req, res) {
    res.render('admin');
});

router.get('/products', function (req, res) {
    // ir buscar todos os produtos existentes no primavera
    var url = "http://localhost:" + config.PORT + "/api/products";
    request.get({ url: url, proxy: config.PROXY }, function (error, response, products) {
        if (!error && response.statusCode == 200) {
            var productsPrimavera = JSON.parse(products);
            // ir buscar todos os produtos existentes na base de dados
            db.getProducts(function(prods) {
                var productsDatabase = prods;
                // deixar só aqueles que não têm row imagem preenchida
                getProductsWithoutImage(productsPrimavera, productsDatabase, function(prods) {
                    console.log(prods);
                    res.render('adminProducts', {products : prods});
                });
            });
        }
        else {
            res.render('404');
        }
    });
});

router.post('/products/addImage/:idProdutoPrimavera', function(req, res) {
    console.log(req.body);
});

function getProductsWithoutImage(prodsPri, prodsDB, next) {
    var result = [];
    for(var i = 0; i < prodsPri.length; i++) {
        for (var j = 0; j < prodsDB.length; j++) {
            if (prodsPri[i].Code == prodsDB[j].idProdutoPrimavera) {
                if (prodsDB[j].imagem == '') {
                    result[i] = prodsDB[j];
                    result[i].Description = prodsPri[i].Description;
                }
            }
        }
    }
    if (typeof next == 'function') {
        next(result);
    }
}

module.exports = router;