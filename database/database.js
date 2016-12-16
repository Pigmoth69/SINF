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
                pool.query('INSERT INTO Produto (idProdutoPrimavera, imagem) VALUES (?, ?)', [temp[i].Code, ''], function (err, rows, fields) {

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

function addProductToCart(idP, idU, qty, next) {
    //check if user has a cart created in the database
    pool.query('SELECT * FROM Carrinho WHERE idUser = ?', idU, function (err, rows, fields) {
        if (rows[0] == undefined) { // criar carrinho
            pool.query('INSERT INTO Carrinho (idUser) VALUES(?)', idU, function (err, rows, fields) {
                auxAddProductToCart(idP, idU, rows.insertId, qty, function (suc) {
                    if (typeof next == 'function')
                        next(suc);
                });
            });
        }
        else { //tem carrinho
            auxAddProductToCart(idP, idU, rows[0].idCarrinho, qty, function (suc) {
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
                        next(null);
                }
            });
        }
    });
}

function auxAddProductToCart(idP, idU, idC, qty, next) {
    //ver se já lá tem algum produto igual
    pool.query('SELECT * FROM ProdutoCarrinho WHERE idProdutoPrimavera = ? AND idCarrinho = ?', [idP, idC], function (err, rows, fields) {
        if (rows.length > 0) { //adicionar um
            pool.query('UPDATE ProdutoCarrinho SET quantidade = quantidade + ? WHERE idProdutoCarrinho = ?', [qty, rows[0].idProdutoCarrinho], function (err, rows, fields) {
                if (typeof next == 'function')
                    next('success');
            });
        }
        else { // criar produto no carrinho
            pool.query('INSERT INTO ProdutoCarrinho(idCarrinho, idProdutoPrimavera, quantidade) VALUES(?,?, ?)', [idC, idP, qty], function (err, rows, fields) {
                if (typeof next == 'function')
                    next('success');
            });
        }
    });
}

function registerUser(idU, username, password, clientType, next) {
    console.log(idU);
    console.log(username);
    console.log(password);
    console.log(clientType);
    pool.query('INSERT INTO User (idUser, username, password, tipo, totalGasto, typeClient, approved) VALUES (?,?,?,?,?,?,?)', [idU, username, password, 1, 0, clientType, true], function (err, rows, fields) {
        if (typeof next == 'function')
            next('success');
    });
}

function removeProductFromCart(idP, idU, quant, next) {
    pool.query('SELECT * FROM Carrinho WHERE idUser = ?', idU, function (err, rows, fields) {
        if (rows.length > 0) {
            pool.query('SELECT * FROM ProdutoCarrinho WHERE idCarrinho = ? AND idProdutoPrimavera = ?', [rows[0].idCarrinho, idP], function (err, prods, fields) {
                if (prods.length > 0) {
                    if (prods[0].quantidade > quant) { // retirar quantidade
                        pool.query('UPDATE ProdutoCarrinho SET quantidade = ? WHERE idProdutoCarrinho = ?', [prods[0].quantidade - quant, prods[0].idProdutoCarrinho], function (err, row, fields) {
                            if (typeof next == 'function')
                                next('sem problema');
                        });
                    }
                    else { //apagar
                        pool.query('DELETE FROM ProdutoCarrinho WHERE idCarrinho = ? AND idProdutoPrimavera = ?', [rows[0].idCarrinho, idP], function (err, row, fields) {
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

function removeCart(idU, next) {
    pool.query('SELECT idCarrinho FROM Carrinho WHERE idUser = ?', idU, function (err, idCar, fields) {
        console.log("IDCAR: ");
        idCar = idCar[0].idCarrinho;
        console.log(idCar);
        pool.query('DELETE FROM ProdutoCarrinho WHERE idCarrinho = ?', idCar, function (err, row, fields) {
            console.log(row);
            if (typeof next == 'function')
                next('sem problema');
        });
    });
}

function removeProductFromCartNo(idP, idU, next) {
    pool.query('SELECT * FROM Carrinho WHERE idUser = ?', idU, function (err, rows, fields) {
        if (rows.length > 0) {
            pool.query('SELECT * FROM ProdutoCarrinho WHERE idCarrinho = ? AND idProdutoPrimavera = ?', [rows[0].idCarrinho, idP], function (err, prods, fields) {
                if (prods.length > 0) {
                    pool.query('DELETE FROM ProdutoCarrinho WHERE idCarrinho = ? AND idProdutoPrimavera = ?', [rows[0].idCarrinho, idP], function (err, row, fields) {
                        if (typeof next == 'function')
                            next('sem problema');
                    });
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

function addImageToProduct(idP, imagem, next) {
    pool.query('UPDATE Produto SET imagem = ? WHERE idProdutoPrimavera = ?', [imagem, idP], function (error, rows, fields) {
        if (typeof next == 'function') {
            next('success');
        }
    });
}

function getUsers(next) {
    pool.query('SELECT * FROM User', function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function getCommentsOnProduct(idP, next) {
    pool.query('SELECT * FROM Comentarios WHERE produto = ?', idP, function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function commentOnProduct(comment, idP, idU, next) {
    pool.query('INSERT INTO Comentarios (comentario, user, produto)' + ' VALUES(?, ?, ?)', [comment, idU, idP], function (err, rows, fields) {
        if (typeof next == 'function')
            next('success');
    });
}

function requestType(idU, type, next) {
    var temp = type + "";
    console.log("idU:" + idU);
    console.log("type:" + type);
    pool.query('SELECT * FROM User WHERE idUser = ? AND typeClient = ?', [idU, type], function (err, rows, fields) {
        if (rows.length > 0) {
            pool.query('UPDATE User SET typeClient = ? WHERE idUser = ?', [type, idU], function (err, rows, fields) {
                pool.query('UPDATE User SET approved = ? WHERE idUser = ?', [false, idU], function (err, rows, fields) {
                    if (typeof next == 'function')
                        next('success');
                });
            });
        }
        else {
            console.log("ENTRAR");
            if (typeof next == 'function')
                next('nope');
        }
    });
}

function getUsersNotApproved(next) {
    pool.query('SELECT * FROM User WHERE approved = ?', false, function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function approveUser(idU, next) {
    pool.query('UPDATE User SET approved = ? WHERE idUser = ?', [true, idU], function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function getProductByID(id, next) {
    pool.query('SELECT * FROM Produto WHERE idProdutoPrimavera = ? AND approved = TRUE', id, function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function getUser(id, next) {
    pool.query('SELECT * FROM User WHERE idUser = ?', id, function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function getApprovedProducts(next) {
    pool.query('SELECT * FROM Produto WHERE approved = TRUE', function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function insertOrder(idO, idU, next){
    pool.query('INSERT INTO Encomenda VALUES (?, 0, ?)', [idO, idU], function(err, rows, fields){

    });
}

function getOrdersNotPayed(next) {
    pool.query('SELECT * FROM Encomenda WHERE pago = FALSE', function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function getOrdersPayed(next) {
    pool.query('SELECT * FROM Encomenda WHERE pago = TRUE', function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

function payOrder(id, next) {
    pool.query('UPDATE Encomenda SET pago = TRUE WHERE idEncomenda = ?', id, function (err, rows, fields) {
        if (typeof next == 'function')
            next(rows);
    });
}

module.exports = {
    populateProducts, getProducts, updateTotalSpent, populateClients, compareLogin, addProductToCart, getCart, removeCart, removeProductFromCart, registerUser, addImageToProduct, getUsers,
    getCommentsOnProduct, commentOnProduct, requestType, getUsersNotApproved, approveUser, getProductByID, getApprovedProducts, removeProductFromCartNo, getUser, getOrdersNotPayed, payOrder,
    getOrdersPayed, insertOrder

};
