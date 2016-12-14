var request = require('request');
var config = require('../config/config.js');

function getCategoriesPrimavera(next) {
    var url = "http://localhost:" + config.PORT + "/api/products/family";
    request.get({ url: url, proxy: config.PROXY }, function (error, response, fams) {
        if (!error && response.statusCode == 200) {
            var famsReal = JSON.parse(fams);
            var famsT = [];
            for (var i = 0; i < famsReal.length; i++) {
                famsT[i] = {};
                famsT[i].Code = famsReal[i];
            }
            if (typeof next == 'function')
                next(famsT);
        }
    });
}

module.exports = { getCategoriesPrimavera };