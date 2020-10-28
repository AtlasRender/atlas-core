/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 22.10.2020, 19:42
 * All rights reserved.
 */

import * as Amqp from "amqplib";
import {Channel, Message} from "amqplib";
import Server from "../core/Server";
import {AMQP_JOBS_QUEUE, AMQP_TASKS_QUEUE} from "../globals";
import JobEvent from "../core/JobEvent";
import RenderTask from "../entities/RenderTask";
import getFramesFromRange from "../utils/getFramesFromRange";
import RenderJob from "../entities/RenderJob";


/**
 * JobsProcessor - function for processing render job queue.
 * @function
 * @async
 * @throws ReferenceError
 * @author Danil Andreev
 */
export default async function JobsProcessor() {
    /**
     * handler - AMQP messages handler.
     * @param message - AMQP message.
     * @throws ReferenceError
     * @author Danil Andreev
     */
    async function handler(message: Message) {
        const channel: Channel = await Server.getCurrent().getRabbit().createChannel();
        const event: JobEvent = new JobEvent(JSON.parse(message.content.toString()));
        const inputJob: RenderJob = event.data;
        const frames: number[] = getFramesFromRange("");


        // Find render job in database.
        const renderJob = RenderJob.findOne({where: {id: inputJob.id}});
        if (!renderJob) throw new ReferenceError(`Can not find specified render job. Render job "id" = '${inputJob.id}' `);

        // Generate render tasks for each frame.
        const tasks: RenderTask[] = [];
        for (const frame in frames) {
            const task = new RenderTask();
            task.frame = +frame;
            task.status = "pending";
            tasks.push(task);
        }

        // Insert generated render tasks to database.
        await RenderTask.createQueryBuilder().insert().values(tasks).execute();

        // Add tasks into RabbitMQ queue
        await channel.assertQueue(AMQP_TASKS_QUEUE);
        for (const task in tasks) {
            channel.sendToQueue(AMQP_TASKS_QUEUE, Buffer.from(JSON.stringify(task)));
        }
    }

    const channel: Channel = await Server.getCurrent().getRabbit().createChannel();
    await channel.assertQueue(AMQP_JOBS_QUEUE);
    await channel.prefetch(1);
    await channel.consume(AMQP_JOBS_QUEUE, async (message: Message) => {
        await handler(message);
        channel.ack(message);
    });
}
