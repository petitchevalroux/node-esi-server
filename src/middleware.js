"use strict";
const path = require("path"),
    EsiController = require(path.join(__dirname, "controller"));

module.exports = (options) => {
    const controller = new EsiController(options || {});
    return (ctx, next) => {
        if (ctx.request.method !== "GET" ||
            ctx.request.path !== "/fragment") {
            return next();
        }
        return controller
            .handle(ctx.request.querystring)
            .then(content => {
                ctx.response.type = "html";
                ctx.response.status = 200;
                ctx.response.body = content;
                return ctx;
            })
            .catch(err => {
                ctx.response.type = "text";
                ctx.response.status = err.status || 500;
                ctx.response.body = err.message;
            });
    };
};
