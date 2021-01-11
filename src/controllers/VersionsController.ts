/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
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
        this.get("/", this.getCurrentVersion);
    }

    /**
     * Route __[GET]__ ___/version - Handler for current version.
     * @method
     * @author Denis Afendikov
     */
    public async getCurrentVersion(ctx: Context): Promise<void> {
        ctx.body = {version: "0.1.2"};
    }
}
