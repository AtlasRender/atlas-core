/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:07
 * All rights reserved.
 */

import * as dotenv from "dotenv";


dotenv.config();

import "globals";

import Server from "./core/Server";
// Interfaces
import ServerConfig from "./interfaces/ServerConfig";

// Controllers
import UsersController from "./controllers/UsersController";
import LoginController from "./controllers/LoginController";
import OrganizationsController from "./controllers/OrganizationsController";
import UserTokensController from "./controllers/UserTokensController";
//import * as config from "./config.json";
import {config} from "./config";


export const server = new Server(config);
server.useController(new UsersController());
server.useController(new LoginController());
server.useController(new OrganizationsController());
server.useController(new UserTokensController());
server.start();
