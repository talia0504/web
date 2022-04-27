"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = __importDefault(require("../controllers/post"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The post API
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - meassage
 *         - sender
 *       properties:
 *         meassage:
 *           type: string
 *           description: The user meassage
 *         sender:
 *           type: string
 *           description: The sender
 *       example:
 *         meassage: 'first message'
 *         sender: 'kfir'
 */
/**
 * @swagger
 * /post/getAllPosts:
 *   get:
 *     summary:get All Posts
 *     tags: [Post]
 *
 *     responses:
 *       200:
 *         description: success
 *
 */
router.get('/', post_1.default.getAllPosts);
/**
 * @swagger
 * /post/createNewPost:
 *   post:
 *     summary: create New Post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: created New Post
 *         content:
 *           application/json:
 *             schema:
 *               message:
 *                 type: string
 *                 description: The message
 *               sender:
 *                 type: string
 *                 description: The sender
 *               _id:
 *                 type: string
 *                 description: The message id
 *             example:
 *               "message":"first message",
 *               "sender": "kfir2"
 *               _id: "adfasdfasdfasdfsd"
 *
 */
router.post('/', auth_middleware_1.default, post_1.default.createNewPost);
router.get('/:id', post_1.default.getPostById);
router.delete('/:id', auth_middleware_1.default, post_1.default.deletePostById);
module.exports = router;
//# sourceMappingURL=post_routes.js.map