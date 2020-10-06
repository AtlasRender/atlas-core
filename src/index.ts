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

import HelloWorld from "./controllers/HelloWorld";
import Test from "./controllers/Test";
import Server, {ServerConfig, ServerOptions} from "./core/Server";
import * as config from "./config.json";

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


const port: string | number = process.env.PORT || 3002;

const additionalConfig: ServerOptions = {
    additionalEntities: [
        RenderJob, User, Role, Organization, OrganizationLog,
        RenderTask, RenderTaskAttempt, RenderTaskAttemptLog, RenderJobLog,
        Plugin, GlobalPlugin, Slave
    ],
};

const server = new Server(config as ServerConfig, additionalConfig);
server.useController(new HelloWorld());
server.useController(new Test());
server.useController(new UsersController());
server.useController(new LoginController());
server.useController(new OrganizationsController());
server.start(port);
