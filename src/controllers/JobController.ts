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


/**
 * JobController - controller for /jobs routes.
 * @class
 * @author Danil Andreev
 */
export default class JobController extends Controller {
    constructor() {
        super("/jobs");
        this.post("/", this.createJobHandler);
    }

    /**
     * Route __[POST]__ ___/jobs___ - handler for job submit.
     * @code 200, 409, 503
     * @throws RequestError
     * @method
     * @author Danil Andreev
     */
    public async createJobHandler(ctx: Context) {
        const job = ctx.request.body;
        try {
            const channel: Amqp.Channel = await Server.getCurrent().getRabbit().createChannel();
            const jobEvent: JobEvent = new JobEvent({
                type: JobEventType.CREATE_JOB,
                data: job,
            });
            if (channel.sendToQueue(AMQP_JOBS_QUEUE, jobEvent.toBuffer())) {
                ctx.status = 200;
            } else {
                throw new RequestError(409, "Unavailable to queue job");
            }
        } catch (error) {
            throw new RequestError(503, "Internal server error. Please, visit this resource later.");
        }
    }
}