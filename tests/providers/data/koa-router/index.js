"use strict";
const DataProvider = require("esi-server-data-koa-router"),
    supertest = require("supertest"),
    path = require("path"),
    {
        Server
    } = require(path.join(__dirname, "..", "..", "..", "..")),
    TemplateProvider = require(path.join(__dirname, "..", "..", "template")),
    templateProvider = new TemplateProvider(),
    dataProvider = new DataProvider(),
    router = dataProvider.getRouter(),
    sinon = require("sinon"),
    Promise = require("bluebird");

router.get("/articles/:id", ctx => {
    return new Promise(resolve => {
        resolve(
            Object.assign({
                title: "My article",
                body: "My body"
            }, {
                id: ctx.params.id
            }));
    });
});

describe("koa-router data provider", () => {
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
    describe("article", () => {
        let templateProviderGetStub;
        beforeEach(() => {
            templateProviderGetStub = new sinon.stub(
                templateProvider, "get");
            templateProviderGetStub.withArgs(
                "article.html")
                .returns({
                    render: (data) => {
                        return JSON.stringify(
                            data);
                    }
                });
        });
        afterEach(() => {
            templateProviderGetStub.restore();
        });
        it("respond with text/html content-type", () => {
            return request
                .get(
                    "/fragment?{\"data\":[\"/articles/1\"],\"tpl\":[\"article.html\"]}"
                )
                .expect("Content-Type",
                    "text/html; charset=utf-8");
        });
        it("respond with parsed article", () => {
            return request
                .get(
                    "/fragment?{\"data\":[\"/articles/1\"],\"tpl\":[\"article.html\"]}"
                )
                .expect(200,
                    "{\"title\":\"My article\",\"body\":\"My body\",\"id\":\"1\"}"
                );
        });
    });
});
