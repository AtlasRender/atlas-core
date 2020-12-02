/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 02.12.2020, 22:06
 * All rights reserved.
 */

import Controller from "../core/Controller";
import RenderJob from "../entities/RenderJob";
import {Context} from "koa";
import RequestError from "../errors/RequestError";
import RenderTask from "../entities/RenderTask";
import JobController from "./JobController";


/**
 * JobController - controller for /jobs routes.
 * @class
 * @author Danil Andreev
 */
export default class TasksController extends Controller {
    constructor() {
        super("/tasks");
        this.get("/", this.getTasks);
        this.get("/:taskId", this.getTask);
    }

    /**
     * checkUserHaveAccessToJob - function, designed check is job available to user.
     * @param userId - User id
     * @param jobId - Job id
     * @author Danil Andreev
     */
    public static async checkUserHaveAccessToJob(userId: number, jobId: number) {
        const jobs: any[] = await RenderJob.getRepository().manager.query(`
            select *
            from (
                     select *
                     from render_job
                     where "organizationId" in (
                         select "organizationId"
                         from user_organizations
                         where "userId" = $1
                     )
                 ) as jobs
            where id = $2
            limit 1
        `, [userId, jobId]);
        return !!jobs.length;
    }

    /**
     * Route __[GET]__ ___/jobs/:jobId/tasks___ - returns all tasks of render job.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getTasks(ctx: Context) {
        const user = ctx.state.user;
        const {jobId} = ctx.params;

        if (!await JobController.checkUserHaveAccessToJob(user.id, jobId))
            throw new RequestError(403, "You don't have permissions to this data.");

        const job = await RenderJob.findOne({where: {id: jobId}});
        if (!job)
            throw new RequestError(404, "Render job not found");

        const tasks = await RenderTask.find({where: {job}});
        if (!tasks)
            throw new RequestError(404, "Render job not found");

        ctx.body = tasks;
    }

    /**
     * Route __[GET]__ ___/jobs/:jobId/tasks/:taskId___ - returns job detailed information.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getTask(ctx: Context) {
        const user = ctx.state.user;
        const {jobId, taskId} = ctx.params;

        if (!await JobController.checkUserHaveAccessToJob(user.id, jobId))
            throw new RequestError(403, "You don't have permissions to this data.");

        const task = await RenderTask.findOne({where: {id: +taskId}});
        if (!task)
            throw new RequestError(404, "Render task not found");

        ctx.body = task;
    }
}