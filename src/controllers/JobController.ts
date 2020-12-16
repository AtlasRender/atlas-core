/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
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
import {JobSubmitValidator} from "../validators/JobRequestValidators";
import Plugin from "../entities/Plugin";
import {PluginSettingsSpec, SettingsPayload, ValidationError} from "@atlasrender/render-plugin";
import User from "../entities/User";
import UserJwt from "../interfaces/UserJwt";
import FrameRange from "../core/FrameRange/FrameRange";
import FrameRangeItem from "../core/FrameRange/FrameRangeItem";
import RenderTask from "../entities/RenderTask";
import {SelectQueryBuilder} from "typeorm";
import RenderTaskAttempt from "../entities/RenderTaskAttempt";


/**
 * JobController - controller for /jobs routes.
 * @class
 * @author Danil Andreev
 */
export default class JobController extends Controller {
    constructor() {
        super("/jobs");
        this.post("/", JobSubmitValidator, this.createJob);
        this.get("/", this.getJobs);
        this.get("/:jobId", this.getJob);
        this.get("/:jobId/tasks", this.getTasks);
        this.delete("/:jobId", this.deleteJob);
        this.delete("/:jobId/fail", this.failJob);

        // const taskController = new TasksController();
        // this.use("/:jobId" + taskController.baseRoute, taskController.routes(), taskController.allowedMethods());
    }

    /**
     * checkUserHaveAccessToJob - function, designed check is job available to user.
     * @param userId - User id
     * @param jobId - Job id
     * @author Danil Andreev
     */
    public static async checkUserHaveAccessToJob(userId: number, jobId: number): Promise<boolean> {
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
     * Route __[DELETE]__ ___/jobs/:jobId/fail___ - fails render job.
     * @code 200, 403, 404
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async failJob(ctx: Context): Promise<void> {
        const user = ctx.state.user;
        const {jobId} = ctx.params;

        const job = await RenderJob.findOne({where: {id: jobId}});
        if (!job)
            throw new RequestError(404, "Render job not found.");

        if (!await JobController.checkUserHaveAccessToJob(user.id, jobId))
            throw new RequestError(403, "You don't have permissions to this data.");

        job.failed = true;
        ctx.body = await job.save();
        // TODO: add subscriber.
    }

    /**
     * Route __[DELETE]__ ___/jobs/:jobId___ - deletes render job.
     * @code 200, 403, 404
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async deleteJob(ctx: Context): Promise<void> {
        const user = ctx.state.user;
        const {jobId} = ctx.params;

        if (!await JobController.checkUserHaveAccessToJob(user.id, jobId))
            throw new RequestError(403, "You don't have permissions to this data.");

        const job: RenderJob = await RenderJob.findOne(jobId);
        if(!job)
            throw new RequestError(404, "Render job not found.");
        const result = await job.remove();


        // const result = await RenderJob.delete({id: jobId});
        //
        // if (!result.affected)
        //     throw new RequestError(404, "Render job not found.");

        // TODO: send message to slave about job fail.

        ctx.body = result;
    }

    /**
     * Route __[POST]__ ___/jobs___ - handler for job submit.
     * @code 200, 409, 503
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async createJob(ctx: Context): Promise<void> {
        let renderJob: RenderJob = null;
        const jwtUser: UserJwt = ctx.state.user;
        try {
            const inputJob = ctx.request.body;

            const user: User = await User.findOne({where: {id: jwtUser.id}});

            const organization: Organization = await Organization.findOne({where: {id: inputJob.organization}});
            if (!organization) throw new ReferenceError(`Organization does not exist`);
            //TODO: check user can create job.


            // Create new render job
            renderJob = new RenderJob();

            try {
                const range: FrameRange = new FrameRange();
                for (const item of inputJob.frameRange) {
                    switch (typeof item) {
                        case "string":
                            range.addRange(item);
                            break;
                        case "object":
                            range.addRange(new FrameRangeItem(item));
                            break;
                        default:
                            throw new TypeError("Invalid token in frame range");
                    }
                }
                renderJob.pendingTasks = range.length;
            } catch (error) {
                throw new RequestError(400, error.message);
            }

            renderJob.name = inputJob.name;
            renderJob.description = inputJob.description;
            renderJob.organization = organization;
            renderJob.attempts_per_task_limit = inputJob.attempts_per_task_limit;
            renderJob.frameRange = inputJob.frameRange;
            renderJob.submitter = user;

            const plugin: Plugin = await Plugin
                .getRepository()
                .createQueryBuilder()
                .from(Plugin, "plugin")
                .select(["plugin.id", "plugin.name", "plugin.rules", "plugin.version"])
                .where("plugin.id = :id", {id: inputJob.plugin})
                .getOne();
            if (!plugin)
                throw new RequestError(404, "Plugin with selected not found", {missing: ["plugin"]});
            renderJob.plugin = plugin;

            let pluginSpec: PluginSettingsSpec = null;
            try {
                pluginSpec = new PluginSettingsSpec(plugin.rules);
            } catch (error) {
                if (error instanceof ValidationError)
                    throw new RequestError(400, `Validation error on plugin "${plugin.name}@${plugin.version}" spec.`, error.getJSON());
            }
            try {
                const pluginPayload = new SettingsPayload(pluginSpec, inputJob.pluginSettings);
                renderJob.pluginSettings = pluginPayload.payload;
            } catch (error) {
                if (error instanceof ValidationError)
                    throw new RequestError(400, "Validation error on plugin settings.", error.getJSON());
            }

            renderJob = await renderJob.save();
            ctx.body = renderJob;
        } catch (error) {
            if (error instanceof RequestError)
                throw error;
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
     * @code 200
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getJobs(ctx: Context): Promise<void> {
        //TODO: add query validator
        //TODO: send not every field.
        const {id, organization: organizationId} = ctx.request.query;
        const jwtUser: UserJwt = ctx.state.user;
        let jobs: RenderJob[] | RenderJob = null;
        if (id == null) {
            if (organizationId != null) {
                const organization = Organization.findOne({where: {id: organizationId}});
                if (!organization)
                    throw new RequestError(404, "Organization not found.");
                jobs = await RenderJob.find({
                    where: {organization},
                    relations: ["submitter", "organization"],
                    order: {createdAt: "DESC"}
                });
            } else {
                const user: User = await User.findOne({where: {id: jwtUser.id}});
                jobs = await RenderJob.find({
                    where: {submitter: user},
                    relations: ["submitter", "organization"],
                    order: {createdAt: "DESC"}
                });
            }
        } else {
            jobs = await RenderJob.findOne({where: {id}, relations: ["submitter", "organization"]});
        }
        ctx.body = jobs;
    }

    /**
     * Route __[GET]__ ___/jobs/:jobId___ - returns job detailed information.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getJob(ctx: Context): Promise<void> {
        const user = ctx.state.user;
        const {jobId} = ctx.params;
        if (!await JobController.checkUserHaveAccessToJob(user.id, jobId))
            throw new RequestError(403, "You don't have permissions to this data.");

        const job = await RenderJob.findOne({where: {id: +jobId}, relations: ["organization"]});
        if (!job)
            throw new RequestError(404, "Render job not found");

        // TODO: add mor info, for example: plugin spec, ...

        ctx.body = job;
    }

    /**
     * Route __[GET]__ ___/jobs/:jobId/tasks___ - returns all tasks of render job.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async getTasks(ctx: Context): Promise<void> {
        const user = ctx.state.user;
        const {jobId} = ctx.params;

        if (!await JobController.checkUserHaveAccessToJob(user.id, jobId))
            throw new RequestError(403, "You don't have permissions to this data.");

        const job = await RenderJob.findOne({where: {id: jobId}});
        if (!job)
            throw new RequestError(404, "Render job not found");

        const tasks = await RenderTask
            .getRepository()
            .createQueryBuilder("task")
            .select(["task.*", "attempt.progress"])
            .where("task.job = :job", {job: job.id})
            .leftJoin((sq: SelectQueryBuilder<RenderTaskAttempt>) => {
                return sq
                    .select(["ordered_attempts.progress", "ordered_attempts.task_id"])
                    .from((sq1: SelectQueryBuilder<RenderTaskAttempt>) => {
                        return sq1
                            .select(["sub_attempt.*"])
                            .addSelect("task.id", "task_id")
                            .from(RenderTaskAttempt, "sub_attempt")
                            .orderBy("sub_attempt.createdAt")
                            .innerJoin("sub_attempt.task", "task")
                    }, "ordered_attempts")
                    .distinctOn(["ordered_attempts.task_id"]);
            }, "attempt", "attempt.task_id = task.id")
            .execute();

        if (!tasks)
            throw new RequestError(404, "Render job not found");

        ctx.body = tasks;
    }
}
