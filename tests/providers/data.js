"use strict";
const Promise = require("bluebird");
class DataProvider {
    get(uri, params) {
        return Promise.resolve({
            data: {
                uri: uri,
                params: params
            }
        });
    }
}

module.exports = DataProvider;
