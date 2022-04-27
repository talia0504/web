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
const post_model_1 = __importDefault(require("../models/post_model"));
/**
 * Gets all the posts
 * @param {http request} req
 * @param {http response} res
 */
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAllPosts");
    try {
        const sender = req.query.sender;
        let posts;
        if (sender != null || sender != undefined) {
            posts = yield post_model_1.default.find({ sender: sender });
        }
        else {
            posts = yield post_model_1.default.find();
        }
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send({
            err: err.message,
        });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getPostById id=" + req.params.id);
    const id = req.params.id;
    if (id == null || id == undefined) {
        return res.status(400).send({ err: "no id provided" });
    }
    try {
        const post = yield post_model_1.default.findById(id);
        if (post == null) {
            res.status(400).send({
                err: "post doesnot exists",
            });
        }
        else {
            res.status(200).send(post);
        }
    }
    catch (err) {
        res.status(400).send({
            err: err.message,
        });
    }
});
/**
 * Create new post
 * @param {http request} req
 * @param {http response} res
 */
const createNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const sender = req.body._id;
    const post = new post_model_1.default({
        message: req.body.message,
        sender: sender,
    });
    try {
        const newPost = yield post.save();
        res.status(200).send(newPost);
    }
    catch (err) {
        res.status(400).send({
            err: err.message,
        });
    }
});
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("deletePostById id=" + req.params.id);
    const id = req.params.id;
    if (id == null || id == undefined) {
        return res.status(400).send({ err: "no id provided" });
    }
    try {
        yield post_model_1.default.deleteOne({ _id: id });
        res.status(200).send();
    }
    catch (err) {
        res.status(400).send({
            err: err.message,
        });
    }
});
module.exports = {
    getAllPosts,
    createNewPost,
    getPostById,
    deletePostById,
};
//# sourceMappingURL=post.js.map