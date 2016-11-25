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
    request.get({ url: 'http://localhost:49822/api/products', proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);

            for (var i = 0; i < temp.length; i++) {
                var img = temp[i].Code + ".png";
                pool.query('INSERT INTO Produto (idProdutoPrimavera, imagem) VALUES (?, ?)', [temp[i].Code, img], function (err, rows, fields) {

                });
            }
            if (typeof next == 'function')
                next('Products populated');
        }
    });
}

function populateClients(next) {
    request.get({ url: 'http://localhost:49822/api/clients', proxy: 'http://localhost:49822' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var temp = JSON.parse(body);

            for (var i = 0; i < temp.length; i++) {
                pool.query('INSERT INTO User (idUser, username, password) VALUES (?, ?, \'teste\')', [temp[i].CodCliente, temp[i].NomeCliente], function (err, rows, fields) {

                });
            }
            if (typeof next == 'function')
                next('Clients populated');
        }
    });
}

function getProducts(next) {
    pool.query('SELECT * FROM Produto', function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function updateTotalSpent(id, nome,next) {
    var war = "http://localhost:49822/api/orders?client=" + id;
    request.get({ url: war, proxy: 'http://localhost:49822' }, function (error, response, re) {
        if (!error && response.statusCode == 200) {
            var re1 = JSON.parse(re);
            //console.log(re1);
            var spent = 0;
            for (var j = 0; j < re1.length; j++) {
                for (var i = 0; i < re1[j].LinhasDoc.length; i++) {
                    console.log(re1[j].LinhasDoc[i].TotalILiquido);
                    spent = spent + re1[j].LinhasDoc[i].TotalILiquido;
                }
                
            }
            //console.log(temp[i]);
            pool.query('INSERT INTO User (idUser, username, password, totalGasto) VALUES(?, ?, \'teste\', ?)', [id, nome, spent], function (err, rows, fields) {
                if (typeof next == 'function')
                    next('sim');
            });
        }
    });
}

function compareLogin(username, password, next){
    console.log("vai comparar " + username + " e " + password);   
    pool.query('SELECT * FROM User WHERE idUser = ? AND password = ?', [username, password], function(err, rows, fields){
        if(typeof next === 'function')
            next(rows);
        if(err){
            console.log("PEIDO");
            throw err;
        }
    });
}

module.exports = { populateProducts, getProducts, updateTotalSpent, populateClients, compareLogin};
