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
import Test from "./controllers/Test";

const app = new Koa();
const nested = new Router();
nested.get("/darkness", (ctx) => {
    ctx.body = "asdf";
})

const test = new Test();

const router = new Router();
router.use(test.getRoute(), test.getRouter().routes(), test.getRouter().allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3002);

// import Server from "./core/Server";
// const server = new Server({port: 3002, controllersDir: __dirname + "\\controllers\\**\\*"});
// server.start();
