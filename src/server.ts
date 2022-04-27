import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

console.log("seerver is starting..");

import mongoose from "mongoose";
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log("connected to mongo");
});

import bodyparser from "body-parser";
app.use(bodyparser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyparser.json());

import post_routes from "./routes/post_routes";
app.use("/post", post_routes);

import auth_routes from "./routes/auth_routes";
app.use("/auth", auth_routes);

import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

if (process.env.NODE_ENV == "development") {
  const swaggerJsDoc = require("swagger-jsdoc");
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Library API",
        version: "1.0.0",
        description: "A simple Express Library API",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

export = app;
