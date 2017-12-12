"use strict";
const path = require("path");
module.exports = {
    "Server": require(path.join(__dirname, "server")),
    "middleware": require(path.join(__dirname, "middleware")),
};
