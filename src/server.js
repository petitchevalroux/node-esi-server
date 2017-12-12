"use strict";
const Koa = require("koa"),
    path = require("path"),
    middleware = require(path.join(__dirname, "middleware"));
class EsiServer extends Koa {
    constructor(options) {
        super();
        this.use(middleware(options));
    }
}

module.exports = EsiServer;
