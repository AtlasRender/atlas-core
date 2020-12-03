/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/3/20, 4:12 PM
 * All rights reserved.
 */

import {EntitySubscriberInterface, EventSubscriber, InsertEvent} from "typeorm";
import RenderTaskAttemptLog from "../entities/RenderTaskAttemptLog";
import User from "../entities/User";
import WebSocket from "../core/WebSocket";
import {CWS_RENDER_JOB_ATTEMPT_LOG_CREATE} from "../globals";


@EventSubscriber()
export default class RenderTaskAttemptLogSubscriber implements EntitySubscriberInterface<RenderTaskAttemptLog> {
    listenTo(): Function | string {
        return RenderTaskAttemptLog;
    }

    public async afterInsert(event: InsertEvent<RenderTaskAttemptLog>): Promise<any> {
        try {
            const log: RenderTaskAttemptLog = await RenderTaskAttemptLog.findOne({
                where: {id: event.entity.id},
                relations: [
                    "renderTaskAttempt",
                    "renderTaskAttempt.task",
                    "renderTaskAttempt.task.job",
                    "renderTaskAttempt.task.job.organization",
                    "renderTaskAttempt.task.job.organization.users",
                ]
            });

            const users: User[] = log.renderTaskAttempt.task.job.organization.users;

            for (const user of users) {
                WebSocket.sendToUser(user.id, {type: CWS_RENDER_JOB_ATTEMPT_LOG_CREATE, payload: {id: log.id}});
            }
        } catch (error) {
            //TODO: handle
        }
    }
}
