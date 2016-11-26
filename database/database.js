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

function updateTotalSpent(id, nome, next) {
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

function compareLogin(idUser, password, next) {
    pool.query('SELECT * FROM User WHERE idUser = ? AND password = ?', [idUser, password], function (err, rows, fields) {
        if (typeof next === 'function')
            next(rows);
        if (err) {
            console.log("PEIDO");
            throw err;
        }
    });
}

function addProductToCart(idP, idU, next) {
    //check if user has a cart created in the database
    pool.query('SELECT * FROM Carrinho WHERE idUser = ?', idU, function (err, rows, fields) {
        if (rows[0] == undefined) { // criar carrinho
            pool.query('INSERT INTO Carrinho (idUser) VALUES(?)', idU, function (err, rows, fields) {
                auxAddProductToCart(idP, idU, rows.insertId, function (suc) {
                    if (typeof next == 'function')
                        next(suc);
                });
            });
        }
        else { //tem carrinho
            auxAddProductToCart(idP, idU, rows[0].idCarrinho, function (suc) {
                if (typeof next == 'function')
                    next(suc);
            });
        }
    });
}

function getCart(idU, next) {
    pool.query('SELECT * FROM Carrinho WHERE idUser = ?', idU, function (err, rows, fields) {
        if (rows[0] == undefined) {
            if (typeof next == 'function')
                next('no carrinho');
        }
        else {
            pool.query('SELECT * FROM ProdutoCarrinho WHERE idCarrinho = ?', rows[0].idCarrinho, function (err, rows, fields) {
                if (rows.length > 0) { // tem merdas no carrinho
                    if (typeof next == 'function')
                        next(rows);
                }
                else {
                    if (typeof next == 'function')
                        next('sem merdas no carrinho');
                }
            });
        }
    });
}

function auxAddProductToCart(idP, idU, idC, next) {
    //ver se já lá tem algum produto igual
    pool.query('SELECT * FROM ProdutoCarrinho WHERE idProdutoPrimavera = ? AND idCarrinho = ?', [idP, idC], function (err, rows, fields) {
        if (rows.length > 0) { //adicionar um
            pool.query('UPDATE ProdutoCarrinho SET quantidade = quantidade + 1 WHERE idProdutoCarrinho = ?', rows[0].idProdutoCarrinho, function (err, rows, fields) {
                if (typeof next == 'function')
                    next('success');
            });
        }
        else { // criar produto no carrinho
            pool.query('INSERT INTO ProdutoCarrinho(idCarrinho, idProdutoPrimavera, quantidade) VALUES(?,?, 1)', [idC, idP], function (err, rows, fields) {
                if (typeof next == 'function')
                    next('success');
            });
        }
    });
}

function removeProductFromCart(idP, idU, quant, next) {
    pool.query('SELECT * FROM Carrinho WHERE idUser = ?', idU, function(err, rows, fields) {
        if (rows.length > 0) {
            pool.query('SELECT * FROM ProdutoCarrinho WHERE idCarrinho = ? AND idProdutoPrimavera = ?', [rows[0].idCarrinho, idP], function(err, prods, fields) {
                if (prods.length > 0) {
                    console.log(quant);
                    console.log(prods);
                    if (prods[0].quantidade > quant) { // retirar quantidade
                        pool.query('UPDATE ProdutoCarrinho SET quantidade = ? WHERE idProdutoCarrinho = ?', [prods[0].quantidade - quant, prods[0].idProdutoCarrinho], function(err, row, fields) {
                            if (typeof next == 'function')
                                next('sem problema');
                        });
                    }
                    else { //apagar
                        pool.query('DELETE FROM ProdutoCarrinho WHERE idCarrinho = ? AND idProdutoPrimavera = ?', [rows[0].idCarrinho, idP], function(err, row, fields) {
                            if (typeof next == 'function')
                                next('sem problema');
                        });
                    }
                }
                else {
                    if (typeof next == 'function')
                        next('problema');
                }
            });
        }  
        else {
            if (typeof next == 'function')
                next('problem');
        }
    });
}

module.exports = { populateProducts, getProducts, updateTotalSpent, populateClients, compareLogin, addProductToCart, getCart, removeProductFromCart};
