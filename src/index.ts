/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:07
 * All rights reserved.
 */

// import 'reflect-metadata' // WTF?
import * as dotenv from "dotenv";

dotenv.config();

import HelloWorld from "./controllers/HelloWorld";
import Test from "./controllers/Test";
import Server, {ServerConfig, ServerOptions} from "./core/Server";
import * as config from "./config.json";
import RenderJob from "./entities/RenderJob";
import User from "./entities/User";
import Organization from "./entities/Organization";
import RenderTask from "./entities/RenderTask";
import RenderTaskAttempt from "./entities/RenderTaskAttempt";
import RenderTaskAttemptLog from "./entities/RenderTaskAttemptLog";
import RenderJobLog from "./entities/RenderJobLog";
import Role from "./entities/Role";


const port: string | number = process.env.PORT || 3002;

const additionalConfig: ServerOptions = {
    additionalEntities: [
        RenderJob, User, Role, Organization, RenderTask, RenderTaskAttempt, RenderTaskAttemptLog, RenderJobLog
    ],
};

const server = new Server(config as ServerConfig, additionalConfig);
server.useController(new HelloWorld());
server.useController(new Test());
server.start(port);
