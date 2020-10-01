/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 21:02
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";

export default class Test extends Controller{
    constructor() {
        super("/hello");
        console.log(`Inited controller on [/hello]`);
        const fnct = (ctx: Context) => ctx.body = "Hello";
        this.get("/darkness", fnct);
    }
    public getHandler(ctx: Context): void {
        console.log("asdf");
        ctx.body = "Kuku";
    }
}