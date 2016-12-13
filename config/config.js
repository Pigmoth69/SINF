var express = require('express');
var router = express.Router();

PORT = 3001;
PROXY = "http://192.168.3.6:3001";

module.exports = {PORT, PROXY};