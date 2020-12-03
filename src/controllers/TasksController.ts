/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 02.12.2020, 22:06
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import RequestError from "../errors/RequestError";
import RenderTask from "../entities/RenderTask";
import JobController from "./JobController";
import UserJwt from "../interfaces/UserJwt";


/**
 * JobController - controller for /jobs routes.
 * @class
 * @author Danil Andreev
 */
export default class TasksController extends Controller {
    constructor() {
        super("/tasks");
        this.get("/:taskId", this.getTask);
        this.get("/:taskId/attempts", this.getAttempts);
    }

    /**
     * Route __[GET]__ ___/tasks/:taskId___ - returns job detailed information.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getTask(ctx: Context): Promise<void> {
        const user = ctx.state.user;
        const {taskId} = ctx.params;

        const task = await RenderTask.findOne({where: {id: +taskId}, relations: ["job"]});
        if (!task)
            throw new RequestError(404, "Render task not found");

        if (!await JobController.checkUserHaveAccessToJob(user.id, task.job.id))
            throw new RequestError(403, "You don't have permissions to this data.");

        delete task.job;
        ctx.body = task;
    }

    /**
     * Route __[GET]__ ___tasks/:taskId/attempts___ - returns all render job attempts for selected task.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getAttempts(ctx: Context): Promise<void> {
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
