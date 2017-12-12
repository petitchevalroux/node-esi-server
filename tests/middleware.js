"use strict";
const path = require("path"),
    {
        middleware
    } = require(path.join(__dirname, "..")),
    assert = require("assert");
describe("middleware", () => {
    it("is a callable function", () => {
        assert.equal(typeof(middleware()), "function");
    });
});
