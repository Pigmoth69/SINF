var request = require('request');

function getCategoriesPrimavera(next) {
    var url = "http://localhost:" + config.PORT + "/api/products/family";
    request.get({ url: url, proxy: config.PROXY }, function (error, response, fams) {
        if (!error && response.statusCode == 200) {
            var famsReal = JSON.parse(fams);
            if (typeof next == 'function')
                next(famsReal);
        }
    });
}

module.exports = { getCategoriesPrimavera };