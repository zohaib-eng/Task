import dotenv from "dotenv";
dotenv.config();

import { fileURLToPath } from "url";
import { dirname } from "path";
import { Module } from "module";
import Server from "./server/index.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.NODE_PATH = __dirname;
Module._initPaths();

Server.init();
