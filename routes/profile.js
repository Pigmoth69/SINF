var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if (req.session.user == undefined)
        res.redirect('/login');
    else res.render('profile');
});

module.exports = router;