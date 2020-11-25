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


@EventSubscriber()
export class RenderTaskSubscriber implements EntitySubscriberInterface<RenderTask> {
    listenTo(): Function | string {
        return RenderTask;
    }

    async afterUpdate(event: UpdateEvent<RenderTask>): Promise<any> {
        if (event.updatedColumns.some(column => column.propertyName === "status")) {
            const task: RenderTask = await RenderTask.findOne({
                where: {id: event.databaseEntity.id},
                relations: ["job"]
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
