var express = require('express');
var router = express.Router();

PORT = 3001;
PROXY = "http://192.168.1.124:3001";

module.exports = {PORT, PROXY};