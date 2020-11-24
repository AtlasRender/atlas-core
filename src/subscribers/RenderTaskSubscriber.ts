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

    afterUpdate(event: UpdateEvent<RenderTask>): Promise<any> | void {
        if (event.updatedColumns.some(column => column.propertyName === "status")) {
            const done: RenderTask[] = await RenderTask
                .createQueryBuilder()

            RenderJob
                .getRepository()
                .createQueryBuilder()
                .from(RenderJob, "job")
                .update()
                .set({
                    done: 0,
                })
                .where("job.id = :id", {id: event.databaseEntity.job.id});
        }
    }
}