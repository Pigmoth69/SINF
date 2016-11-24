var mysql = require('mysql');
var request = require('request');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: '95.85.20.178',
    user: 'mentesadmin',
    password: 'mentes-empreendedoras',
    database: 'SINF'
});


function populateProducts(next) {
    request.get({url : 'http://localhost:49822/api/products', proxy : 'http://localhost:49822'}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);

            for (var i = 0; i < temp.length; i++) {
                var img = temp[i].Code + ".png";
                pool.query('INSERT INTO Produto (idProdutoPrimavera, imagem) VALUES (?, ?)', [temp[i].Code, img], function(err, rows, fields) {

                });
            }
            if (typeof next == 'function')
                next('Products populated');
        }
    });
}

//TODO
function populateUsers(next) {
    request.get({url : 'http://localhost:49822/api/products', proxy : 'http://localhost:49822'}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);

            for (var i = 0; i < temp.length; i++) {
                var img = temp[i].Code + ".png";
                pool.query('INSERT INTO Produto (idProdutoPrimavera, imagem) VALUES (?, ?)', [temp[i].Code, img], function(err, rows, fields) {

                });
            }
            if (typeof next == 'function')
                next('Products populated');
        }
    });
}

module.exports = {populateProducts};