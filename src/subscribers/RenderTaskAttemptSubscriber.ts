/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 09.12.2020, 18:43
 * All rights reserved.
 */

import {EntitySubscriberInterface, EventSubscriber, UpdateEvent} from "typeorm";
import RenderTaskAttempt from "../entities/typeorm/RenderTaskAttempt";
import User from "../entities/typeorm/User";
import ClientWS from "../core/ClientWS";
import {CWS_RENDER_TASK_UPDATE} from "../globals";
import Logger from "../core/Logger";


@EventSubscriber()
export default class RenderTaskAttemptSubscriber implements EntitySubscriberInterface<RenderTaskAttempt> {
    listenTo(): Function | string {
        return RenderTaskAttempt;
    }

    public async afterUpdate(event: UpdateEvent<RenderTaskAttempt>): Promise<any> {
        try {
            const attempt: RenderTaskAttempt = await RenderTaskAttempt.findOne({
                where: {id: event.databaseEntity.id},
                relations: ["task", "task.job", "task.job.organization", "task.job.organization.users"]
            });

            const users: User[] = attempt.task.job.organization.users;

            for (const user of users) {
                ClientWS.sendToUser(user.id, {type: CWS_RENDER_TASK_UPDATE, payload: {id: attempt.task.id}});
            }
        } catch (error) {
            //TODO: handle
            Logger.error()(error.message, error.stack).then();
        }
    }
}