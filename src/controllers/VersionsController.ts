/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: atlas-core
 * File last modified: 03.11.2020, 19:49
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";


/**
 * VersionsController - controller for /version route.
 * @class
 * @author Denis Afendikov
 */
export default class VersionsController extends Controller {
    constructor() {
        super("/version");
        this.post("/", this.getCurrentVersion);
    }

    /**
     * Route __[GET]__ ___/version - Handler for current version.
     * @method
     * @author Denis Afendikov
     */
    public async getCurrentVersion(ctx: Context): Promise<void> {
        ctx.body = {version: "1.0.0"};
    }
}
