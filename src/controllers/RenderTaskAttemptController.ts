/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 02.12.2020, 22:24
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import RenderTask from "../entities/RenderTask";
import JobController from "./JobController";
import UserJwt from "../interfaces/UserJwt";
import RequestError from "../errors/RequestError";


export default class RenderTaskAttemptController extends Controller {
    constructor() {
        super("/attempts");
        this.get("/", this.getAttempts);
    }

    public async getAttempts(ctx: Context) {
        const userJwt: UserJwt = ctx.state.user;
        const {taskId} = ctx.params;

        const task: RenderTask = await RenderTask.findOne({where: {id: taskId}, relations: ["renderTaskAttempts", "job"]})
        if (!task)
            throw new RequestError(404, "Task not found");
        if (!await JobController.checkUserHaveAccessToJob(userJwt.id, task.job.id))
            throw new RequestError(403, "You have no access to view this data.");

        ctx.body = task.renderTaskAttempts;
    }
}