"use strict";
const supertest = require("supertest"),
    path = require("path"),
    {
        Server
    } = require(path.join(__dirname, "..")),
    DataProvider = require(path.join(__dirname, "providers", "data")),
    dataProvider = new DataProvider(),
    TemplateProvider = require(path.join(__dirname, "providers", "template")),
    templateProvider = new TemplateProvider(),
    sinon = require("sinon"),
    assert = require("assert");

describe("Server", () => {
    let httpServer,
        request;
    before(() => {
        httpServer = new Server({
            templateProvider: templateProvider,
            dataProvider: dataProvider
        })
            .listen();
        request = supertest(httpServer);
    });
    after(() => {
        httpServer.close();
    });
    describe("GET /fragment", () => {
        it("respond with text/plain content-type", () => {
            return request
                .get("/fragment")
                .expect("Content-Type",
                    "text/plain; charset=utf-8");
        });
        it("respond with 400 status", () => {
            return request
                .get("/fragment")
                .expect(400, "Invalid query string");
        });
    });

    describe("GET /fragment?533", () => {
        it("respond with 400 status", () => {
            return request
                .get("/fragment?533")
                .expect(400, "Non object query string");
        });
    });

    describe("GET /fragment?{}", () => {
        it("respond with 400 status", () => {
            return request
                .get("/fragment?{}")
                .expect(400,
                    "Missing tpl: Can't render a fragment without a template"
                );
        });
    });

    describe("GET /fragment?{\"tpl\":\"/foo\"}", () => {
        it("respond with 200 status", () => {
            return request
                .get("/fragment?{\"tpl\":\"/foo\"}")
                .expect(200,
                    "{\"arguments\":[\"/foo\"]}");
        });
        it("call template provider with /foo as first argument",
            () => {
                const spy = sinon.spy(templateProvider,
                    "get");
                return request
                    .get("/fragment?{\"tpl\":\"/foo\"}")
                    .expect(200)
                    .then(() => {
                        assert.equal("/foo", spy.getCall(
                            0)
                            .args[0]);
                        spy.restore();
                        return;
                    });
            });
    });

    describe("GET /fragment?{\"tpl\":[\"/foo\",123]}", () => {
        it("respond with 200 status", () => {
            return request
                .get(
                    "/fragment?{\"tpl\":[\"/foo\",123]}"
                )
                .expect(200,
                    "{\"arguments\":[\"/foo\",123]}");
        });
        it("call template provider with rights arguments", () => {
            const spy = sinon.spy(templateProvider,
                "get");
            return request
                .get(
                    "/fragment?{\"tpl\":[\"/foo\",123]}"
                )
                .then(() => {
                    assert.deepEqual(["/foo", 123],
                        spy.getCall(0)
                            .args);
                    spy.restore();
                    return;
                });
        });
    });

});
