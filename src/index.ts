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
import Server from "./core/Server";
import {Connection, createConnection} from "typeorm";

dotenv.config();

const port: string | number = process.env.PORT || 3002;

const server = new Server({/*controllersDir: __dirname + "\\controllers\\**\\*"*/});
server.useController(new HelloWorld());
server.useController(new Test());
server.start(port);


async function DB_connect() {
    const connection: Connection = await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "afendikov_db",
        entities: [__dirname + "/entities/*.entity.ts"]
    });

    return connection;
}
