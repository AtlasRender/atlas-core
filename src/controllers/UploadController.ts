/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import * as _ from "lodash";
import * as fs from "fs";
import {ReadStream} from "fs";
// @ts-ignore
import Temp from "../entities/Temp";
import RequestError from "../errors/RequestError";
import streamToBuffer from "./../utils/streamToBuffer";
import User from "../entities/User";


/**
 * UploadController - controller for /file route.
 * @class
 * @author Danil Andreev
 */
export default class UploadController extends Controller {
    constructor() {
        super("/file");
        this.post("/", this.uploadFile);
        this.get("/:id", this.downloadFile);
        this.delete("/:id", this.removeFile);
    }

    /**
     * Route __[POST]__ ___/file___ - Adds new temp file.
     * @code 200
     * @method
     * @author DanilAndreev
     */
    public async uploadFile(ctx: Context) {
        const user = ctx.state.user;
        const files: File[] = _.values((ctx.request as any).files);
        const results = [];
        const {pub} = ctx.request.query;

        //TODO; limit files amount per user.

        const userStored: User = await User.findOne({where: {id: user.id}});
        if (!user)
            throw new RequestError(400, "User don't exist.");


        for (const file of files) {
            const path = (file as any).path;
            const reader: ReadStream = fs.createReadStream(path);
            const buffer: Buffer = await streamToBuffer(reader);

            const temp = new Temp();
            temp.data = buffer;
            temp.meta = {
                type: file.type,
            }
            if (!pub) temp.owner = userStored;
            const result: Temp = await temp.save();

            results.push({name: file.name, type: file.type, id: result.id});
        }

        ctx.body = results;
    }

    /**
     * Route __[GET]__ ___/file/:id___ - Get temp record.
     * @code 200, 404, 423
     * @method
     * @author DanilAndreev
     */
    public async downloadFile(ctx: Context) {
        const user = ctx.state.user;
        const {remove} = ctx.request.query;
        const {id} = ctx.params;

        const file: Temp = await Temp.findOne({where: {id}});

        if (!file)
            throw new RequestError(404, "File not found.");
        if(file.owner.id !== user.id)
            throw new RequestError(423, "You don't have permissions to view this data.");

        ctx.set("Content-Type", "multipart/form-data");
        ctx.body = file;

        if (remove)
            await Temp.delete({id: file.id});
    }

    /**
     * Route __[DELETE]__ ___/file/:id___ - Removes file from temp.
     * @code 200, 404, 423
     * @method
     * @author DanilAndreev
     */
    public async removeFile(ctx: Context) {
        const user = ctx.state.user;
        const {id} = ctx.params;

        const file: Temp = await Temp.getRepository().createQueryBuilder().addSelect(["id", "owner"]).getOne();

        if (!file)
            throw new RequestError(404, "File not found.");

        if(file.owner.id !== user.id)
            throw new RequestError(423, "You don't have permissions to view this data.");

        await Temp.delete({id: file.id});
    }
}
