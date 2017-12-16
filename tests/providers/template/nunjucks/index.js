"use strict";
const TemplateProvider = require("esi-server-template-nunjucks"),
    supertest = require("supertest"),
    nunjucks = TemplateProvider.nunjucks,
    path = require("path"),
    {
        Server
    } = require(path.join(__dirname, "..", "..", "..", "..")),
    DataProvider = require(path.join(__dirname, "..", "..", "data")),
    dataProvider = new DataProvider(),
    templateProvider = new TemplateProvider(new nunjucks.FileSystemLoader(path.join(
        __dirname, "views"))),
    sinon = require("sinon"),
    Promise = require("bluebird");
describe("nunjucks template provider", () => {
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
        let dataProviderGetStub;
        beforeEach(() => {
            dataProviderGetStub = new sinon.stub(
                dataProvider, "get");
            dataProviderGetStub.withArgs("/articles/1")
                .returns(new Promise.resolve({
                    title: "My article",
                    body: "My body"
                }));
        });
        afterEach(() => {
            dataProviderGetStub.restore();
        });
        it("respond with text/html content-type", () => {
            return request
                .get(
                    "/fragment?{\"data\":[\"/articles/1\"],\"tpl\":[\"article.html\",{\"titleTag\":\"h1\"}]}"
                )
                .expect("Content-Type",
                    "text/html; charset=utf-8");
        });
        it("respond with parsed article", () => {
            return request
                .get(
                    "/fragment?{\"data\":[\"/articles/1\"],\"tpl\":[\"article.html\",{\"titleTag\":\"h1\"}]}"
                )
                .expect(200, "<article>\n" +
                    "    <h1 class=\"title\">My article</h1>\n" +
                    "    <div class=\"body\">\n" +
                    "        My body\n" +
                    "    </div>\n" +
                    "</article>");
        });
    });
});
