/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 07.01.2021, 14:40
 * All rights reserved.
 */

import ServerConfig from "../src/interfaces/ServerConfig";
import RenderJob from "../src/entities/RenderJob";
import User from "../src/entities/User";
import UserToken from "../src/entities/UserToken";
import UserPrivateData from "../src/entities/UserPrivateData";
import Role from "../src/entities/Role";
import Organization from "../src/entities/Organization";
import OrganizationLog from "../src/entities/OrganizationLog";
import RenderTask from "../src/entities/RenderTask";
import RenderTaskAttempt from "../src/entities/RenderTaskAttempt";
import RenderTaskAttemptLog from "../src/entities/RenderTaskAttemptLog";
import RenderJobLog from "../src/entities/RenderJobLog";
import Plugin from "../src/entities/Plugin";
import GlobalPlugin from "../src/entities/GlobalPlugin";
import Slave from "../src/entities/Slave";
import SystemLog from "../src/entities/SystemLog";
import Temp from "../src/entities/Temp";
import {RenderTaskSubscriber} from "../src/subscribers/RenderTaskSubscriber";
import {RenderJobSubscriber} from "../src/subscribers/RenderJobSubscriber";
import RenderTaskAttemptLogSubscriber from "../src/subscribers/RenderTaskAttemptLogSubscriber";
import RenderTaskAttemptSubscriber from "../src/subscribers/RenderTaskAttemptSubscriber";


export const config: ServerConfig = {
    appDebug: true,
    port: 3002,
    db: {
        type: "sqlite",
        database: "/data/data.sqlite",
        // logging: true,
        entities: [
            RenderJob, User, UserToken, UserPrivateData, Role, Organization, OrganizationLog,
            RenderTask, RenderTaskAttempt, RenderTaskAttemptLog, RenderJobLog,
            Plugin, GlobalPlugin, Slave, SystemLog, Temp
        ],
        subscribers: [
            RenderTaskSubscriber, RenderJobSubscriber, RenderTaskAttemptLogSubscriber, RenderTaskAttemptSubscriber
        ]
    },
    redis: {
    },
    rabbit: {
    }
};