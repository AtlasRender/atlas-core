/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/3/20, 4:03 PM
 * All rights reserved.
 */

import {EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent} from "typeorm";
import RenderJob from "../entities/RenderJob";
import User from "../entities/User";
import WebSocket from "../core/WebSocket";
import {CWS_RENDER_JOB_CREATE, CWS_RENDER_JOB_DELETE, CWS_RENDER_JOB_UPDATE} from "../globals";
import Organization from "../entities/Organization";
import Logger from "../core/Logger";


@EventSubscriber()
export class RenderJobSubscriber implements EntitySubscriberInterface<RenderJob> {
    listenTo(): Function | string {
        return RenderJob;
    }

    public async afterInsert(event: InsertEvent<RenderJob>): Promise<any> {
        try {
            const organization: Organization = await Organization.findOne({
                where: {id: event.entity.organization.id},
                relations: ["users"]
            });

            const users: User[] = organization.users;

            for (const user of users) {
                WebSocket.sendToUser(user.id, {type: CWS_RENDER_JOB_CREATE, payload: {id: event.entity.id}});
            }
        } catch (error) {
            //TODO: handle
            console.error(error);
        }
    }

    public async afterUpdate(event: UpdateEvent<RenderJob>): Promise<any> {
        try {
            const job: RenderJob = await RenderJob.findOne({
                where: {id: event.databaseEntity.id},
                relations: ["organization", "organization.users"]
            });

            const users: User[] = job.organization.users;

            for (const user of users) {
                WebSocket.sendToUser(user.id, {type: CWS_RENDER_JOB_UPDATE, payload: {id: job.id}});
            }
        } catch(error) {
            //TODO: handle.
            console.error(error);
        }
    }

    public async beforeRemove(event: RemoveEvent<RenderJob>): Promise<any> {
        try {
            const job: RenderJob = await RenderJob.findOne({
                where: {id: event.databaseEntity.id},
                relations: ["organization", "organization.users"]
            });

            const users: User[] = job.organization.users;
            for (const user of users) {
                WebSocket.sendToUser(user.id, {type: CWS_RENDER_JOB_DELETE, payload: {id: job.id}});
            }
        } catch(error) {
            //TODO: handle.
            console.error(error);
            Logger.error(error.message + " " + error.stack).then();

        }
    }
}
