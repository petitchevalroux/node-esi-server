"use strict";
const Koa = require("koa"),
    path = require("path"),
    esiMiddleware = require(path.join(__dirname, "middleware"));
class EsiServer extends Koa {
    constructor(options) {
        super();
        if (Array.isArray(options.middlewares)) {
            options.middlewares.forEach(middleware => {
                this.use(middleware);
            });
        }
        this.use(esiMiddleware(options));
    }
}

module.exports = EsiServer;
