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

// Entities
import RenderJob from "./entities/RenderJob";
import User from "./entities/User";
import Organization from "./entities/Organization";
import RenderTask from "./entities/RenderTask";
import RenderTaskAttempt from "./entities/RenderTaskAttempt";
import RenderTaskAttemptLog from "./entities/RenderTaskAttemptLog";
import RenderJobLog from "./entities/RenderJobLog";
import Role from "./entities/Role";
import OrganizationLog from "./entities/OrganizationLog";
import Plugin from "./entities/Plugin";
import Slave from "./entities/Slave";
import GlobalPlugin from "./entities/GlobalPlugin";

// Controllers
import UsersController from "./controllers/UsersController";
import LoginController from "./controllers/LoginController";
import OrganizationsController from "./controllers/OrganizationsController";
//import * as config from "./config.json";
import {config} from "./config";


const server = new Server(config);
server.useController(new UsersController());
server.useController(new LoginController());
server.useController(new OrganizationsController());
server.start();
