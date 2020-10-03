/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:07
 * All rights reserved.
 */

import * as dotenv from "dotenv";
import HelloWorld from "./controllers/HelloWorld";
import Test from "./controllers/Test";
import Server, {ServerConfig, ServerOptions} from "./core/Server";
import * as config from "./config.json";
import CustomerEntity from "./entities/Customer.entity";
import JobEntity from "./entities/Job.entity";
import UserEntity from "./entities/User.entity";

dotenv.config();

const port: string | number = process.env.PORT || 3002;

const additionalConfig: ServerOptions = {
    additionalEntities: [CustomerEntity, JobEntity, UserEntity],
}

const server = new Server(config as ServerConfig, additionalConfig);
server.useController(new HelloWorld());
server.useController(new Test());
server.start(port);
