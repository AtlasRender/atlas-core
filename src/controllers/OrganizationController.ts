/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 06.10.2020, 23:45
 * All rights reserved.
 */


import Controller from "../core/Controller";
import {Context} from "koa";

import User from "../entities/User";
import Authenticator from "../core/Authenticator";


/**
 * OrganizationController - controller for /organization routes.
 * @class
 * @author Denis Afendikov
 */
export default class OrganizationController extends Controller {
    constructor() {
        super("/organization");
    }

    /**
     * Route __[POST]__ ___/login - handler for user login.
     * @method
     * @author Denis Afendikov
     */
    public async loginHandler(ctx: Context): Promise<void> {

    }
}
