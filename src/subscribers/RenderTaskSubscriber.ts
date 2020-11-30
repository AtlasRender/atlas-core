/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/24/20, 5:06 PM
 * All rights reserved.
 */

import {EntitySubscriberInterface, EventSubscriber, UpdateEvent} from "typeorm";
import RenderTask from "../entities/RenderTask";
import RenderJob from "../entities/RenderJob";
import User from "../entities/User";
import WebSocket from "../core/WebSocket";
import {CWS_RENDER_JOB_UPDATE} from "../globals";


@EventSubscriber()
export class RenderTaskSubscriber implements EntitySubscriberInterface<RenderTask> {
    listenTo(): Function | string {
        return RenderTask;
    }

    async afterUpdate(event: UpdateEvent<RenderTask>): Promise<any> {
        try {
            const task: RenderTask = await RenderTask.findOne({
                where: {id: event.databaseEntity.id},
                relations: ["job", "job.organization", "job.organization.users"]
            });

            const users: User[] = task.job.organization.users;

            for (const user of users) {
                WebSocket.sendToUser(user.id, {type: CWS_RENDER_JOB_UPDATE, payload: {id: task.job.id}});
            }
        } catch (error) {
            //TODO: handle error
        }

        if (event.updatedColumns.some(column => column.propertyName === "status")) {
            const task: RenderTask = await RenderTask.findOne({
                where: {id: event.databaseEntity.id},
                relations: ["job", "job.organization", "job.organization.users"]
            });
            const job: RenderJob = task.job;

            const done: any[] = await RenderTask
                .getRepository()
                .createQueryBuilder("task")
                .select("COUNT(task.status)", "quantity")
                .addSelect(["task.status"])
                .where("task.job = :job", {job: job.id})
                .groupBy("task.status")
                .printSql()
                .getRawMany();

            for (const report of done) {
                switch (report.task_status) {
                    case "pending":
                        job.pendingTasks = +report.quantity;
                        break;
                    case "processing":
                        job.processingTasks = +report.quantity;
                        break;
                    case "done":
                        job.doneTasks = +report.quantity;
                        break;
                    case "failed":
                        job.failedTasks = +report.quantity;
                        break;
                    default:
                        //TODO: add log to db
                }
            }

            await job.save();
        }
    }
}
