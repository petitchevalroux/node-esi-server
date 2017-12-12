"use strict";
const Promise = require("bluebird");
class TemplateProvider {
    get() {
        const getArguments = Array.from(arguments);
        return Promise.resolve({
            render: (data) => {
                return JSON.stringify({
                    "arguments": getArguments,
                    data: data
                });
            }
        });
    }
}

module.exports = TemplateProvider;
