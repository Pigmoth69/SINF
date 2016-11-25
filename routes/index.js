var express = require('express');
var router = express.Router();
var db = require('../database/database.js');

router.get('/', function(req, res) {
    res.render('inventory');
});

router.post('/login', function(req, res, next){
    console.log("entra aqui " + req.body.username + " e " + req.body.password);
    if(req.session.user === undefined){
        db.compareLogin(req.body.username, req.body.password, function(rows){
            if(rows[0] != undefined){
                req.session.user = rows[0].idUser;
                req.session.name = rows[0].username;
                req.session.typeUser = rows[0].tipo;
                console.log("login correto");
                res.redirect('/');
            }else{
                console.log("credenciais erradas");
                res.redirect('/login');
            }
            
            
        });
    }else{
        console.log("already logged in");
        res.redirect('/login');
    }
})

module.exports = router;
