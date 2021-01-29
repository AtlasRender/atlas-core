/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import root from "../utils/getProjectRoot";
import * as fs from "fs";
import RequestError from "../errors/RequestError";
import Route from "../decorators/Route";
import HTTPController from "../decorators/HTTPController";


/**
 * VersionsController - controller for /version route.
 * @class
 * @author Denis Afendikov
 */
@HTTPController("/version")
export default class VersionsController extends Controller {
    /**
     * Route __[GET]__ ___/version___ - Handler for current version.
     * @method
     * @author Denis Afendikov
     */
    @Route("GET", "/")
    public async getCurrentVersion(ctx: Context): Promise<void> {
        try {
            const version: string = JSON.parse(fs.readFileSync(root + "./../package.json").toString()).version;
            ctx.body = {version};
        } catch (error) {
            throw new RequestError(400, "Unable to get version.");
        }
    }
}
