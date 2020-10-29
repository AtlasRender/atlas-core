/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/29/20, 2:35 PM
 * All rights reserved.
 */

import {Channel, Message} from "amqplib";
import Server from "../core/Server";
import {AMQP_TASK_REPORTS_QUEUE} from "../globals";
import RenderTask from "../entities/RenderTask";
import RenderTaskAttempt from "../entities/RenderTaskAttempt";


/**
 * TaskReportsProcessor - function for processing render task reports queue.
 * @function
 * @async
 * @throws ReferenceError
 * @author Danil Andreev
 */
export default async function TaskReportsProcessor() {
    /**
     * handler - AMQP messages handler.
     * @param message - AMQP message.
     * @throws ReferenceError
     * @author Danil Andreev
     */
    async function handler(message: Message) {
        const handleStart = async (body) => {
            const {task, reportType, slave} = body;
            const renderTask = await RenderTask.findOne({where: {id: task}});
            if (!renderTask)
                throw new ReferenceError(`Render task with id "${body.task}" does not exist`);

            const attempt = new RenderTaskAttempt();
            attempt.slave = slave; // TODO: finish slave linking;
            attempt.task = task;
            await attempt.save();
        };
        const handleReport = async (body) => {
            const {task, reportType, slave} = body;
            const attempt = RenderTaskAttempt.findOne();
        };
        const handleFinish = async (body) => {
        };

        try {
            const body = JSON.parse(message.content.toString());
            const {action} = body;
            switch (action) {
                case "start":
                    await handleStart(body);
                    break;
                case "report":
                    await handleReport(body);
                    break;
                case "finish":
                    await handleFinish(body);
                    break;
                default: {
                    // TODO: handler error
                }
            }

        } catch (error) {

        }
    }

    const channel: Channel = await Server.getCurrent().getRabbit().createChannel();
    await channel.assertQueue(AMQP_TASK_REPORTS_QUEUE);
    await channel.prefetch(10);
    await channel.consume(AMQP_TASK_REPORTS_QUEUE, async (message: Message) => {
        await handler(message);
        channel.ack(message);
    });
}