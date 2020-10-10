/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:07
 * All rights reserved.
 */

import * as dotenv from "dotenv";
import "globals";

import HelloWorld from "./controllers/HelloWorld";
import Test from "./controllers/Test";
import Server, {ServerConfig} from "./core/Server";
//import * as config from "./config.json";
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

dotenv.config();


const port: number = +process.env.PORT || 3002;

const config: ServerConfig = {
    port: port,
    db: {
        type: "postgres",
        // url: "postgres://postgres:postgres@104.197.241.243:5432/postgres",
        host: "104.197.241.243",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "postgres",
        entities: [
            RenderJob, User, Role, Organization, OrganizationLog,
            RenderTask, RenderTaskAttempt, RenderTaskAttemptLog, RenderJobLog,
            Plugin, GlobalPlugin, Slave
        ],
    },
    redis: {
        port: 6379,
        host: "104.197.241.243",
    },
    rabbit: {
        host: "104.197.241.243",
        port: 5672,
        ssl: {
            enabled: false
        }
    }
};

const server = new Server(config);
server.useController(new HelloWorld());
server.useController(new Test());
server.useController(new UsersController());
server.useController(new LoginController());
server.useController(new OrganizationsController());
server.start(port);
