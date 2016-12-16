var express = require('express');
var router = express.Router();
var db = require('../database/database.js');
var config = require('../config/config.js');
var request = require('request');
var jimp = require('jimp');
var async = require('async');

router.get('/', function (req, res) {
    res.render('admin');
});

router.get('/ordersProcessing', function(req, res) {
    db.getOrdersPayed(function(ords) {
        // fazer async com as ords para pedir merdas ao primavera
        res.render('adminProcessing', {orders : ords});
    });
});

router.get('/ordersNotPayed', function(req, res) {
    db.getOrdersNotPayed(function(ords) {
        // fazer async com as ords para pedir merdas ao primavera
        res.render('adminOrders', {orders : ords});
    });
});

router.post('/acceptPayment/:idE', function(req, res) {
    db.payOrder(req.params.idE, function(r) {
        // fazer pedido ao primavera a dizer que foi pago
        res.redirect('/admin');
    });
});

router.get('/products', function (req, res) {
    // ir buscar todos os produtos existentes no primavera
    var url = "http://localhost:" + config.PORT + "/api/products";
    request.get({ url: url, proxy: config.PROXY }, function (error, response, products) {
        if (!error && response.statusCode == 200) {
            var productsPrimavera = JSON.parse(products);
            // ir buscar todos os produtos existentes na base de dados
            db.getProducts(function (prods) {
                var productsDatabase = prods;
                // deixar só aqueles que não têm row imagem preenchida
                getProductsWithoutImage(productsPrimavera, productsDatabase, function (prods) {
                    //console.log(prods);
                    res.render('adminProducts', { products: prods });
                });
            });
        }
        else {
            res.render('404');
        }
    });
});

router.get('/users', function (req, res) {
    //ir a bd e ver que users é que querem mudar o tipo
    db.getUsersNotApproved(function (rows) {
        var url = "http://localhost:" + config.PORT + "/api/clients/types";
        request.get({ url: url, proxy: config.PROXY }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var types = JSON.parse(body);
                url = "http://localhost:" + config.PORT + "/api/clients/types";

                async.each(rows, function (item, callback) {
                    db.getUser(item.idUser, function (user) {
                        var url = "http://localhost:" + config.PORT + "/api/clients?id=" + item.idUser;
                        request.get({ url: url, proxy: config.PROXY }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var userPri = JSON.parse(body);
                                for (var i = 0; i < types.length; i++) {
                                    if (types[i].Code == userPri.ClientType)
                                        item.clientTypeOld = types[i].Description;
                                }
                                callback();
                            }
                            
                        });
                    });
                }, function (err) {
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < types.length; j++) {
                            if (rows[i].typeClient == types[j].Code)
                                rows[i].clientType = types[j].Description;
                        }
                    }
                    console.log(rows);
                    res.render('adminUsers', {
                        users: rows
                    });
                });
            }
        });
    });
});

router.get('/updatePrimavera', function (req, res) {
    db.populateProducts(function (respo) {
        if (respo == 'Products populated') {
            res.redirect('/admin');
        }
        else {
            res.render('404');
        }
    });
});

router.post('/acceptUser/:idU/:type', function (req, res) {
    db.approveUser(req.params.idU, function (rows) {
        
        var quer = "http://localhost:" + config.PORT + "/api/clients?id=" + req.params.idU; //MUDAR ESTA LINHA
        var form = {};
        form.Address = "";
        form.Address2 = "";
        form.CodClient = "";
        form.NameClient = "";
        form.FiscalName = "";
        form.TaxpayNumber = "";
        form.Email = "";
        form.PostCode = "";
        form.Local = "";
        form.Phone = "";
        form.Phone2 = "";
        form.Country = "";
        form.ClientDiscount = "";
        form.PaymentType = "";
        form.PaymentWay = "";
        form.ClientType = req.params.type;
        form.District = "";
        form.ExpeditionWay = "";
        form.Currency = "";
 
        request.put({ url: quer, proxy: config.PROXY, json: form }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.redirect('/admin/users');
            }
            else {
                //
            }
        });
        
    });
});

router.post('/products/addImage/:idProdutoPrimavera', function (req, res) {
    const fs = require('fs');
    const path = require('path');
    console.log(req.files.image);

    var new_path = path.join(path.dirname(__dirname), 'public');
    new_path = path.join(new_path, 'images');
    new_path = path.join(new_path, req.params.idProdutoPrimavera + path.extname(req.files.image.file));
    var source = fs.createReadStream(req.files.image.file);
    var dest = fs.createWriteStream(new_path);
    source.pipe(dest);
    source.on('end', function () {
        var path_temp = path.basename(new_path);
        db.addImageToProduct(req.params.idProdutoPrimavera, path_temp, function (resp) {
            if (resp == 'success') {
                // obtain an image object:
                jimp.read(new_path).then(function (lenna) {
                    lenna.resize(200, 200)            // resize 
                        .quality(100)                 // set JPEG quality
                        .write(new_path); // save 
                }).catch(function (err) {
                    console.error(err);
                });
                res.redirect('/admin');
            }
            else {
                res.render('404');
            }
        });
    });
    source.on('error', function (err) { console.log(error) });
});

function getProductsWithoutImage(prodsPri, prodsDB, next) {
    var result = [];
    for (var i = 0; i < prodsPri.length; i++) {
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