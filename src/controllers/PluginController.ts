/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: atlas-core
 * File last modified: 11/10/20, 3:01 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import {PLUGIN_SETTING_TYPES} from "../globals";
import RequestError from "../errors/RequestError";
import Temp from "../entities/Temp";


/**
 * PluginController - controller for /plugins route.
 * @class
 * @author Danil Andreev
 */
export default class PluginController extends Controller {
    constructor() {
        super("/plugins");
        this.post("/", this.addPlugin);
    }

    public static validatePluginSettings(settings: object): boolean {
        if (typeof settings !== "object") return false;
        for (const key in settings) {
            if (!PLUGIN_SETTING_TYPES.includes(settings[key])) return false;
        }
        return true;
    }

    /**
     * Route __[POST]__ ___/plugins___ - Adds new plugin.
     * @code 200
     * @method
     * @author DanilAndreev
     */
    public async addPlugin(ctx: Context): Promise<void> {
        const {organization} = ctx.request.query;
        const body = ctx.request.body;

        if (!PluginController.validatePluginSettings(body.settings))
            throw new RequestError(400, "Invalid plugin settings");

        const file = await Temp.findOne({where: {id: body.file}});



        Temp.delete({id: file.id}).then();

    }
}
