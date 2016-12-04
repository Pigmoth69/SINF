var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log('entrei');
    res.render('admin');
});

module.exports = router;