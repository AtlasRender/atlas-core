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
import Logger from "../core/Logger";
import RenderTaskAttemptLog from "../entities/RenderTaskAttemptLog";


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
     * @param channel
     * @author Danil Andreev
     */
    async function handler(message: Message, channel: Channel) {
        const handleStart = async (body) => {
            console.log("handleStart -------------", body);
            const {task, reportType, slave} = body;
            console.log("HandleStart: Looking for render task");
            const renderTask = await RenderTask.findOne({where: {id: task}, relations: ["renderTaskAttempts"]});
            if (!renderTask)
                throw new ReferenceError(`Render task with id "${body.task}" does not exist`);
            console.log("render task: ", renderTask);
            if (renderTask.renderTaskAttempts.some(item => item.status === "done"))
                throw new ReferenceError(`Task with id "${renderTask.id}" is already finished with positive status.`);

            // TODO: is task is processing via other slave and last report was
            //  long time ago - fail current task and start new with input slave.

            console.log("HandleStart: Creating new attempt");
            let attempt = new RenderTaskAttempt();
            // attempt.slaveUID = slave.UID; // TODO: finish slave linking;
            attempt.slaveUID = slave;
            attempt.task = task;
            attempt.status = "processing";
            attempt = await attempt.save();
            console.log("HandleStart: Creating new attempt finished");

            console.log("HandleStart: Creating new attempt log");
            const attemptLog = new RenderTaskAttemptLog();
            attemptLog.renderTaskAttempt = attempt;
            attemptLog.data = `Starting render process on slave "'${attempt.slaveUID}".`;
            attemptLog.type = "info";
            await attemptLog.save();
            console.log("HandleStart: Creating new attempt log finished");
        };
        const handleReport = async (body) => {
            console.log("handleReport -----------------", body);
            // TODO: check "data" type
            const {task, reportType, slave, data} = body;
            if (!(reportType === "info" || reportType === "warning" || reportType === "error"))
                throw new TypeError(`Incorrect type of reportType, expected "'info' | 'warning' | 'error', got "${reportType}"`);

            const attempt: RenderTaskAttempt = await RenderTaskAttempt.findOne({where: {status: "processing", task}});
            if (!attempt)
                throw new ReferenceError(`No processing task has been found.`);
            if (attempt.slaveUID !== slave) // TODO: Change to slave.UID
                throw new ReferenceError(`Task attempt "${attempt.id}" belongs to another slave.`);

            const attemptLog = new RenderTaskAttemptLog();
            attemptLog.renderTaskAttempt = attempt;
            attemptLog.type = reportType;
            attemptLog.data = data;
            await attemptLog.save();
        };
        const handleFinish = async (body) => {
            console.log("handleFinish ----------", body);
            // TODO: check "data" type
            const {task, reportType, slave, data} = body;
            if (!(reportType === "info" || reportType === "warning" || reportType === "error"))
                throw new TypeError(`Incorrect type of reportType, expected "'info' | 'warning' | 'error', got "${reportType}"`);

            const attempt = await RenderTaskAttempt.findOne({where: {status: "processing", task}, relations: ["task"]});
            if (!attempt)
                throw new ReferenceError(`No processing task has been found.`);
            if (attempt.slaveUID !== slave) // TODO: Change to slave.UID
                throw new ReferenceError(`Task attempt "${attempt.id}" belongs to another slave.`);

            const attemptLog = new RenderTaskAttemptLog();
            attemptLog.renderTaskAttempt = attempt;
            attemptLog.type = reportType;
            attemptLog.data = data;
            await attemptLog.save();

            const renderTask = attempt.task;
            renderTask.status = reportType === "error" ? "failed" : "done";

            attempt.status = reportType === "error" ? "failed" : "done";
            await Promise.all([attempt.save(), renderTask.save()]);
        };

        try {
            const body = JSON.parse(message.content.toString());
            // console.log("REPORT PAYLOAD -----------------------------------------------------");
            // console.log(body);
            // console.log("REPORT PAYLOAD END -------------------------------------------------");

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
                default:
                    throw new TypeError(`Incorrect action type, expected "'start' | 'report' | 'finish'", got "${action}"`);
            }
            channel.ack(message);
        } catch (error) {
            console.error(error);
            if (error instanceof ReferenceError)
                channel.ack(message);
            else
                channel.nack(message);

            await Logger.error({
                message: error.message
            });
        }
    }

    const channel: Channel = await Server.getCurrent().getRabbit().createChannel();
    await channel.assertQueue(AMQP_TASK_REPORTS_QUEUE);
    await channel.prefetch(1);
    await channel.consume(AMQP_TASK_REPORTS_QUEUE, async (message: Message) => {
        console.log("Processing job report");
        await handler(message, channel);
    });
}
