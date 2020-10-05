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
import Job from "./entities/Job.entity";
import User from "./entities/User.entity";
import Organization from "./entities/Organization.entity";


const port: string | number = process.env.PORT || 3002;

const additionalConfig: ServerOptions = {
    additionalEntities: [Job, User, Organization],
};

const server = new Server(config as ServerConfig, additionalConfig);
server.useController(new HelloWorld());
server.useController(new Test());
server.start(port);
