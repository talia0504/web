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
const user_model_1 = __importDefault(require("../models/user_model"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * register
 * @param {http req} req
 * @param {http res} res
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("register");
    //validate email/password
    const email = req.body.email;
    const password = req.body.password;
    if (email == null ||
        email == undefined ||
        password == null ||
        password == undefined) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    //encrypt password
    const salt = yield bcrypt_1.default.genSalt(10);
    const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
    //check if email is not already taken
    //save user in DB
    const user = new user_model_1.default({
        email: email,
        password: encryptedPassword,
    });
    try {
        const newUser = yield user.save();
        //login - create access token
        const accessToken = yield jsonwebtoken_1.default.sign({ _id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        const refreshToken = yield jsonwebtoken_1.default.sign({ _id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, {});
        newUser.refreshToken = refreshToken;
        yield newUser.save();
        res.status(http_status_codes_1.StatusCodes.OK).send({
            access_token: accessToken,
            refresh_token: refreshToken,
            _id: newUser._id,
        });
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: err.message });
    }
});
/**
 * login
 * @param {http req} req
 * @param {http res} res
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .send({ error: "wrong email or password" });
    }
    try {
        // check password match
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .send({ error: "wrong email or password" });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .send({ error: "wrong email or password" });
        }
        //calc accesstoken
        const accessToken = yield jsonwebtoken_1.default.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
        const refreshToken = yield jsonwebtoken_1.default.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {});
        user.refreshToken = refreshToken;
        yield user.save();
        res.status(http_status_codes_1.StatusCodes.OK).send({
            access_token: accessToken,
            refresh_token: refreshToken,
            _id: user._id,
        });
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: err.message });
    }
});
/**
 * renewToken
 * get new access token by the refresh token
 * @param {http req} req
 * @param {http res} res
 */
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("renewToken");
    // validate refresh token
    let token = req.headers["authorization"];
    if (token == undefined || token == null) {
        return res.sendStatus(http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    token = token.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, userId) => __awaiter(void 0, void 0, void 0, function* () {
        if (err != null) {
            return res.sendStatus(http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        req.body._id = userId;
        try {
            const user = yield user_model_1.default.findById(userId);
            if (user.refreshToken != token) {
                user.refreshToken = "";
                yield user.save();
                return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({ error: err.message });
            }
            const accessToken = yield jsonwebtoken_1.default.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
            const refreshToken = yield jsonwebtoken_1.default.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {});
            user.refreshToken = refreshToken;
            yield user.save();
            res.status(http_status_codes_1.StatusCodes.OK).send({
                access_token: accessToken,
                refresh_token: refreshToken,
                _id: userId,
            });
        }
        catch (err) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).send({ error: err.message });
        }
    }));
});
/**
 * test
 * @param {http req} req
 * @param {http res} res
 */
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).send({});
});
module.exports = {
    register,
    login,
    renewToken,
    test,
};
//# sourceMappingURL=auth.js.map