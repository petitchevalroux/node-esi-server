"use strict";
const Promise = require("bluebird");

class EsiController {
    constructor(options) {
        this.templateProvider = options.templateProvider;
        this.dataProvider = options.dataProvider;
    }
    handle(query) {
        const self = this;
        return this.parseQuery(query)
            .then(query => {
                try {
                    const promises = [
                        self.templateProvider.get
                            .apply(self.templateProvider, query.tpl)
                    ];
                    if (typeof(query.data) !== "undefined") {
                        promises.push(
                            self.dataProvider.get.apply(
                                self.dataProvider, query.data
                            )
                        );
                    }
                    return Promise.all(promises);
                } catch (err) {
                    throw self.getError("Invalid parameters", 400);
                }
            })
            .then(([template, data]) => {
                if (typeof(template.render) !== "function") {
                    throw self.getError(
                        "template.render is not a function", 500);
                }
                return template.render(data);
            });
    }
    parseQuery(query) {
        const self = this;
        return new Promise(resolve => {
            let parsedQuery;
            try {
                parsedQuery = JSON.parse(decodeURIComponent(query));
            } catch (err) {
                throw self.getError("Invalid query string", 400);
            }
            if (typeof(parsedQuery) !== "object") {
                throw self.getError("Non object query string", 400);
            }
            const tplType = typeof(parsedQuery.tpl);
            if (tplType === "undefined") {
                throw self.getError(
                    "Missing tpl: Can't render a fragment without a template",
                    400);
            }
            if (["string", "number"].indexOf(tplType) !== -1) {
                parsedQuery.tpl = [parsedQuery.tpl];
            }
            if (!Array.isArray(parsedQuery.tpl)) {
                throw self.getError("Invalid tpl", 400);
            }
            resolve(parsedQuery);
        });
    }

    getError(message, status) {
        return Object.assign(new Error(message), {
            status: status
        });
    }
}

module.exports = EsiController;
