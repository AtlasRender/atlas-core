/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/22/20, 4:58 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import Server from "../core/Server";
import * as Amqp from "amqplib";
import RequestError from "../errors/RequestError";
import {AMQP_JOBS_QUEUE} from "../globals";
import JobEvent, {JobEventType} from "../core/JobEvent";
import Organization from "../entities/Organization";
import RenderJob from "../entities/RenderJob";
import getFramesFromRange from "../utils/getFramesFromRange";
import {JobSubmitValidator} from "../validators/JobRequestValidators";
import RenderTask from "../entities/RenderTask";


/**
 * JobController - controller for /jobs routes.
 * @class
 * @author Danil Andreev
 */
export default class JobController extends Controller {
    constructor() {
        super("/jobs");
        this.post("/", JobSubmitValidator, this.createJobHandler);
        this.get("/", this.getJobs);
        this.get("/:jobId", this.getJob);
        this.get("/:jobId/tasks", this.getTasks);
        this.get("/:jobId/tasks/:taskId", this.getTask);
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
     * Route __[POST]__ ___/jobs___ - handler for job submit.
     * @code 200, 409, 503
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async createJobHandler(ctx: Context) {
        let renderJob: RenderJob = null;
        const user = ctx.state.user;
        try {
            const inputJob = ctx.request.body;

            const organization: Organization = await Organization.findOne({where: {id: inputJob.organization}});
            if (!organization) throw new ReferenceError(`Organization does not exist`);
            //TODO: check user can create job.

            try {
                getFramesFromRange(inputJob.frameRange);
            } catch (error) {
                throw new RequestError(400, error.message);
            }

            // Create new render job
            renderJob = new RenderJob();
            renderJob.name = inputJob.name;
            renderJob.description = inputJob.description;
            renderJob.organization = organization;
            renderJob.attempts_per_task_limit = inputJob.attempts_per_task_limit;
            renderJob.frameRange = inputJob.frameRange;
            renderJob = await renderJob.save();
        } catch (error) {
            throw new RequestError(503, "Internal server error. Please, visit this resource later.");
        }
        try {
            const channel: Amqp.Channel = await Server.getCurrent().getRabbit().createChannel();
            const jobEvent: JobEvent = new JobEvent({
                type: JobEventType.CREATE_JOB,
                data: renderJob,
            });
            await channel.assertQueue(AMQP_JOBS_QUEUE, {});
            if (channel.sendToQueue(AMQP_JOBS_QUEUE, Buffer.from(JSON.stringify(jobEvent)))) {
                console.log("Sent job to queue");
                ctx.status = 200;
            } else {
                throw new RequestError(409, "Unavailable to queue job");
            }
            await channel.close();
        } catch (error) {
            if (error instanceof RequestError)
                throw error;
            throw new RequestError(503, "Internal server error. Please, visit this resource later.");
        }
    }

    /**
     * Route __[get]__ ___/jobs___ - returns all jobs available for user.
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getJobs(ctx: Context) {
        const user = ctx.state.user;
        const jobs = await RenderJob.getRepository().manager.query(`
            select *
            from render_job
            where "organizationId" in (
                select "organizationId"
                from user_organizations
                where "userId" = $1
            )
        `, [user.id]);
        ctx.body = jobs;
    }

    /**
     * Route __[GET]__ ___/jobs/:id___ - returns job detailed information.
     * @code 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getJob(ctx: Context) {
        const user = ctx.state.user;
        const {jobId} = ctx.params;
        if (!await JobController.checkUserHaveAccessToJob(user.id, jobId))
            throw new RequestError(403, "You don't have permissions to this data.");

        const job = await RenderJob.findOne({where: {id: +jobId}});
        if (!job)
            throw new RequestError(404, "Render job not found");

        ctx.body = job;
    }

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
