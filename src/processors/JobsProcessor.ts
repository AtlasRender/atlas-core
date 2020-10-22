/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 22.10.2020, 19:42
 * All rights reserved.
 */

import {Channel} from "amqplib";
import Server from "../core/Server";
import {AMQP_JOBS_QUEUE} from "../globals";
import * as Amqp from "amqplib";
import JobEvent from "../core/JobEvent";
import RenderJobFields from "../interfaces/RenderJobFields";
import RenderTask from "../entities/RenderTask";
import RenderTaskFields from "../interfaces/RenderTaskFields";


export default async function JobsProcessor() {
    function handler(message: Amqp.Message) {
        const event: JobEvent = new JobEvent(JSON.parse(message.content.toString()));
        const job: RenderJobFields = event.data;
        //const frames: number[] = getFramesFromRange();

        const tasks: RenderTask[] = [];
        for (const frame in frames) {
            // const task: RenderTaskFields = {
            //     frame: frame,
            //     status: "pending",
            //     job: job,
            // };
            // tasks.add();
        }
        RenderTask.createQueryBuilder().insert().values({

        });
    }

    const channel: Channel = await Server.getCurrent().getRabbit().createChannel();
    await channel.prefetch(1);
    await channel.consume(AMQP_JOBS_QUEUE, handler);
}
