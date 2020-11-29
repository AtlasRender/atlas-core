/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import RequestError from "../errors/RequestError";
import Temp from "../entities/Temp";
import * as UnZipper from "unzipper";
import * as StreamBuffers from "stream-buffers";
import streamToBuffer from "../utils/streamToBuffer";
import Plugin from "../entities/Plugin";
import Organization from "../entities/Organization";
import {PluginCreateBodyValidator} from "../validators/PluginRequestValidators";
import {PluginSettingsSpec, ValidationError} from "@atlasrender/render-plugin";


/**
 * PluginController - controller for /plugins route.
 * @class
 * @author Danil Andreev
 */
export default class PluginController extends Controller {
    constructor() {
        super("/plugins");
        this.post("/", PluginCreateBodyValidator, this.addPlugin);
        //TODO: add validation
        this.get("/", this.getPlugins);
        this.get("/:id/preview", this.getPluginPreview);
    }


    /**
     * Route __[POST]__ ___/plugins___ - Adds new plugin.
     * @code 200, 404, 409, 400
     * @method
     * @author DanilAndreev
     */
    public async addPlugin(ctx: Context): Promise<void> {
        // TODO: Add file meta checks
        // TODO: Add name and version checks.
        // TODO: add organization to plugin
        const {organization: orgId, packed} = ctx.request.query;
        const body = ctx.request.body;

        const file: Temp = await Temp.findOne({where: {id: body.file}});
        if (!file)
            throw new RequestError(404, "Temp file not found.", {missedFile: [body.file]});

        const pluginStored: Plugin = await Plugin
            .getRepository()
            .createQueryBuilder()
            .select(["plugin.id", "plugin.name", "plugin.version"])
            .from(Plugin, "plugin")
            .where("plugin.name = :name", {name: body.name})
            .andWhere("plugin.version = :version", {version: body.version})
            .getOne();
        if (pluginStored)
            throw new RequestError(409, "Plugin with this version already exists.");

        const plugin = new Plugin();

        if (orgId) {
            const organization: Organization = await Organization.findOne({where: {id: orgId}});
            if (!organization)
                throw new RequestError(404, "Organization not found.");
            plugin.organization = organization;
        }

        if (!packed) {
            plugin.name = body.name;
            plugin.description = body.description;
            plugin.note = body.note;
            plugin.version = body.version;

            try {
                plugin.rules = new PluginSettingsSpec(body.settings);
            } catch (error) {
                if (error instanceof ValidationError)
                    throw new RequestError(400, "Plugin settings validation error.", error.getJSON());
                else
                    throw error;
            }

            plugin.script = file.data.toString();
            plugin.readme = body.readme;
        } else {
            try {
                const stream = new StreamBuffers.ReadableStreamBuffer({
                    chunkSize: 2048
                });
                stream.put(file.data);
                await stream
                    .pipe(UnZipper.Parse())
                    .on("entry", async (entry) => {
                        const {path, type, size} = entry;
                        switch (path.toLowerCase()) {
                            case "spec.json": {
                                const buffer: Buffer = await streamToBuffer(entry);
                                try {
                                    const settings: object = JSON.parse(buffer.toString());
                                    plugin.rules = new PluginSettingsSpec(settings);
                                } catch (error) {
                                    if (error instanceof ValidationError)
                                        throw new RequestError(400, "Plugin settings validation error.", error.getJSON());
                                    else if (error instanceof SyntaxError)
                                        throw new RequestError(400, "Syntax error in spec.json", {file: "spec.json"});
                                    else
                                        throw error;
                                }
                            }
                                break;
                            case "meta.json": {
                                const buffer: Buffer = await streamToBuffer(entry);
                                try {
                                    const meta: any = JSON.parse(buffer.toString());
                                    plugin.name = meta.name;
                                    plugin.description = meta.description;
                                    plugin.version = meta.version;
                                    plugin.note = meta.note;
                                } catch (error) {
                                    if (error instanceof ValidationError)
                                        throw new RequestError(400, "Plugin settings validation error.", error.getJSON());
                                    else if (error instanceof SyntaxError)
                                        throw new RequestError(400, "Syntax error in meta.json", {file: "meta.json"});
                                    else
                                        throw error;
                                }
                            }
                                break;
                            case "main.js": {
                                const buffer: Buffer = await streamToBuffer(entry);
                                const text: string = buffer.toString();
                                plugin.script = text;
                            }
                                break;
                            case "readme.md": {
                                const buffer: Buffer = await streamToBuffer(entry);
                                if (buffer.length > 10000)
                                    throw new RequestError(400, "Readme.md file is too big.", {file: "readme.md"});
                                const text: string = buffer.toString();
                                plugin.readme = text;
                            }
                                break;
                            default:
                                entry.autodrain();
                        }
                    })
                    .promise();
            } catch (error) {
                if (error instanceof RequestError)
                    throw error;
                throw new RequestError(400, "Bad request");
            } finally {
                Temp.delete({id: file.id}).then();
            }
        }

        await plugin.save();
        ctx.status = 200;
    }

    /**
     * Route __[GET]__ ___/plugins___ - Get all organization plugins.
     * @code 200,404
     * @method
     * @author DanilAndreev
     */
    public async getPlugins(ctx: Context) {
        const {organization: organizationId} = ctx.request.query;

        const organization: Organization = await Organization.findOne({where: {id: organizationId}});
        if (!organization)
            throw new RequestError(404, "No organization found.");

        const plugins: Plugin[] = await Plugin
            .getRepository()
            .createQueryBuilder("plugin")
            .select(["plugin.id", "plugin.name", "plugin.description", "plugin.note"])
            .where("plugin.organization = :id", {id: organization.id})
            .getMany();

        ctx.body = plugins;
    }

    public async getPluginPreview(ctx: Context) {
        const {id} = ctx.params;

        const plugin: Plugin = await Plugin
            .getRepository()
            .createQueryBuilder("plugin")
            .select(["plugin.id", "plugin.name", "plugin.description", "plugin.note", "plugin.readme"])
            .where("plugin.id = :id", {id})
            .getOne();

        if (!plugin)
            throw new RequestError(404, "Plugin not found.");

        ctx.body = plugin;
    }
}
