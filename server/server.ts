import bodyParser from "body-parser";
import express, { Application } from "express";
import http, { Server } from "http";
import indexRoutes from "./routes/index.routes.js";

const PORT = 4000;
const app: Application = express();
const server: Server = http.createServer(app);

const startServer = async () => {
  app.use("/", express.static("./public"));

  app.use(bodyParser.json({}));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/", indexRoutes);
  app.set("port", PORT);

  server.listen(app.get("port"), () => {
    console.log(`> Ready on: ${app.get("port")}`);
  });

  console.log(`Server started on port ${app.get("port")}`);
};

startServer();
