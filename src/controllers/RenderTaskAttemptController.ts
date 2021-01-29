/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 02.12.2020, 22:24
 * All rights reserved.
 */

import Controller from "../core/Controller";
import {Context} from "koa";
import RenderTask from "../entities/typeorm/RenderTask";
import JobController from "./JobController";
import RequestError from "../errors/RequestError";
import RenderTaskAttempt from "../entities/typeorm/RenderTaskAttempt";
import RenderTaskAttemptLog from "../entities/typeorm/RenderTaskAttemptLog";
import Authenticator from "../core/Authenticator";
import HTTPController from "../decorators/HTTPController";
import Route from "../decorators/Route";


/**
 * RenderTaskAttemptController - controller for /attempts route.
 * @class
 * @author Danil Andreev
 */
@HTTPController("/attempts")
export default class RenderTaskAttemptController extends Controller {
    /**
     * Route __[GET]__ ___attempts/:attemptId___ - returns render task attempt detailed information.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    @Route("GET", ":attemptId")
    public async getAttempt(ctx: Context): Promise<void> {
        const userJwt: Authenticator.UserJwt = ctx.state.user;
        const {attemptId} = ctx.params;

        const attempt: RenderTaskAttempt = await RenderTaskAttempt.findOne(
            {
                where: {id: attemptId},
                relations: ["task", "task.job"]
            });

        if (!attempt)
            throw new RequestError(404, "Render task not found.");

        if (!await JobController.checkUserHaveAccessToJob(userJwt.id, attempt.task.job.id))
            throw new RequestError(403, "You have no access to view this data.");

        delete attempt.task;
        ctx.body = attempt;
    }

    /**
     * Route __[GET]__ ___attempts/:attemptId/log___ - returns all render task attempt logs.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    @Route("GET", "/:attemptId/log")
    public async getAttemptLogs(ctx: Context): Promise<void> {
        const userJwt: Authenticator.UserJwt = ctx.state.user;
        const {attemptId} = ctx.params;

        const attempt: RenderTaskAttempt = await RenderTaskAttempt.findOne(
            {
                where: {id: attemptId},
                relations: ["task", "task.job", "logs"]
            });

        if (!attempt)
            throw new RequestError(404, "Render task not found.");

        if (!await JobController.checkUserHaveAccessToJob(userJwt.id, attempt.task.job.id))
            throw new RequestError(403, "You have no access to view this data.");

        ctx.body = attempt.logs;
    }

    /**
     * Route __[GET]__ ___attempts/:attemptId/log/:logId___ - returns all render task attempt logs.
     * @code 200, 404, 403
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    @Route("GET", "/:attemptId/log/:logId")
    public async getAttemptLog(ctx: Context): Promise<void> {
        const userJwt: Authenticator.UserJwt = ctx.state.user;
        const {attemptId, logId} = ctx.params;

        const attempt: RenderTaskAttempt = await RenderTaskAttempt.findOne(
            {
                where: {id: attemptId},
                relations: ["task", "task.job"]
            });

        if (!attempt)
            throw new RequestError(404, "Render task not found.");

        if (!await JobController.checkUserHaveAccessToJob(userJwt.id, attempt.task.job.id))
            throw new RequestError(403, "You have no access to view this data.");

        const log: RenderTaskAttemptLog = await RenderTaskAttemptLog.findOne({where: {id: logId}});

        if (!log)
            throw new RequestError(404, "Render task log record not found.");

        ctx.body = log;
    }
}
