var express = require('express');
var router = express.Router();

PORT = 49822;
PROXY = "http://localhost:49822";

module.exports = {PORT, PROXY};