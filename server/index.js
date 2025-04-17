// Package Imports
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";

// Local Imports
import Database from "../Database/index.js";
import Router from "../Routes/index.js";

import port from "../config/index.js";

class Server {
  static server = express();
  static init() {
    const { server } = Server;
    server.use(bodyParser.json());
    server.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    server.use(express.urlencoded({ extended: true }));
    server.use(cors({ origin: "*" }));

    server.use(express.json());
    Database.connects();
    const routes = Router.getRoutes(server);
    server.use("/", routes);
    const httpServer = createServer(server);
    httpServer.listen(port.port, () => {
      console.log(`App is running on port ${port.port}.`);
    });
  }
}

export default Server;
