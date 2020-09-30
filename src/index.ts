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

const app = new Koa();

const router = new Router();

router.get("/hello", (ctx, next) => {
    ctx.body = "sdfasf asdf"
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3002);

// import Server from "./core/Server";
//
// const server = new Server({port: 3002, controllersDir: "./controllers"}).start();
