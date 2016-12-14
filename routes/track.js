var express = require('express');
var router = express.Router();
var config = require('../config/config.js');

var fs = require('fs');
var request = require('request');
var pdf = require('html-pdf');
var path = require('path');
var mime = require('mime');

router.get('/', function (req, res) {

    var numPerPage = 10;
    var orderURL = "http://localhost:" + config.PORT + "/api/orders/" + user + "?page=" + req.params.page + "&numperpage=" + numPerPage;
    var orderURL2 = "http://localhost:" + config.PORT + "/api/orders/" + user + "/total";
    request.get({ url: orderURL, proxy: config.PROXY }, function (error, response, orders) {

        if (!error && response.statusCode == 200) {
            var ordersJ = JSON.parse(orders);
            console.log(ordersJ);

            res.render('order', { orders: ordersJ, totalPage: totalP, page: req.params.page, pageA: pagel, pageB: pagei });
        }
        else {

        }
    });

});