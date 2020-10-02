/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:07
 * All rights reserved.
 */

import * as Koa from "koa";
import * as Router from "koa-router";
import {Context} from "koa";

const app = new Koa();
const router = new Router();
router.get("/kuku", (ctx: Context) => {
    ctx.body = "Kuku";
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3002);


// import * as dotenv from "dotenv";
//
// dotenv.config();

// import Server from "./core/Server";
// import {createConnection, Connection, getManager} from "typeorm";


// const server = new Server({controllersDir: __dirname + "\\controllers\\**\\*"});
// server.start(3002);
//
//
// async function DB_connect() {
//     const connection: Connection = await createConnection({
//         type: "mysql",
//         host: "localhost",
//         port: 3306,
//         username: "root",
//         password: "",
//         database: "afendikov_db",
//         entities: [__dirname + "/entities/*.entity.ts"]
//     });
//
//     return connection;
// }
