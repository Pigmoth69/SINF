var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '95.85.20.178',
    user: 'mentesadmin',
    dateStrings: 'date',
    password: 'mentes-empreendedoras',
    database: 'SINF'
});

function compareLogin(username, password, next){
    console.log("vai comparar " + username + " e " + password);   
    pool.query('SELECT * FROM User WHERE username = ? AND password = ?', [username, password], function(err, rows, fields){
        if(typeof next === 'function')
            next(rows);
        if(err){
            console.log("PEIDO");
            throw err;
        }
    });
}

module.exports = {compareLogin};