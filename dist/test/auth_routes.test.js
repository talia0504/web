"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user_model"));
const email = "test@a.com";
const wrongEmail = "test2@a.com";
const password = "1234567890";
const wrongPassword = "44444444";
let accessToken = "";
let refreshToken = "";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    //set the token expiration to 3 sec so it will expire for the refresh test.
    process.env.TOKEN_EXPIRATION = '3s';
    // clear Posts collection
    yield user_model_1.default.deleteMany({ email: email });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.deleteMany({ email: email });
    mongoose_1.default.connection.close();
}));
describe("This is Auth API test", () => {
    test("Test register API", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default)
            .post("/auth/register")
            .send({ email: email, password: password });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.access_token;
        refreshToken = response.body.refresh_token;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/test")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).toEqual(200);
    }));
    test("Test login API", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default)
            .post("/auth/login")
            .send({ email: email, password: password });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.access_token;
        refreshToken = response.body.refresh_token;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/test")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).toEqual(200);
    }));
    test("Test register taken email API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post("/auth/register")
            .send({ email: email, password: password });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test login wrong email API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post("/auth/login")
            .send({ email: wrongEmail, password: password });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("Test login wrong password API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default)
            .post("/auth/login")
            .send({ email: email, password: wrongPassword });
        expect(response.statusCode).not.toEqual(200);
    }));
    test("test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        //wait untill access token is expiered
        yield sleep(3000);
        let response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/test")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).not.toEqual(200);
        response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/refresh")
            .set({ authorization: "barer " + refreshToken });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.access_token;
        refreshToken = response.body.refresh_token;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();
        console.log("new access token " + accessToken);
        response = yield (0, supertest_1.default)(server_1.default)
            .get("/auth/test")
            .set({ authorization: "barer " + accessToken });
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=auth_routes.test.js.map