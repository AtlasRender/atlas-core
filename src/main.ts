/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/14/21, 5:32 PM
 * All rights reserved.
 */

import Server from "./core/Server";
import {config} from "./config";
import JobsProcessor from "./processors/JobsProcessor";
import TaskReportsProcessor from "./processors/TaskReportsProcessor";
import UserNotificationProcessor from "./processors/UserNotificationProcessor";
import ClientWS from "./core/ClientWS";
import UsersController from "./controllers/UsersController";
import LoginController from "./controllers/LoginController";
import OrganizationsController from "./controllers/OrganizationsController";
import UserTokensController from "./controllers/UserTokensController";
import JobController from "./controllers/JobController";
import VersionsController from "./controllers/VersionsController";
import UploadController from "./controllers/UploadController";
import PluginController from "./controllers/PluginController";
import TasksController from "./controllers/TasksController";
import RenderTaskAttemptController from "./controllers/RenderTaskAttemptController";


export default async function main() {
    const server = await Server.createServer(config);
    await JobsProcessor();
    await TaskReportsProcessor();
    await UserNotificationProcessor();

    const webSocketClient = new ClientWS();

    server.useController(new UsersController());
    server.useController(new LoginController());
    server.useController(new OrganizationsController());
    server.useController(new UserTokensController());
    server.useController(new JobController());
    server.useController(new VersionsController());
    server.useController(new UploadController());
    server.useController(new PluginController());
    server.useController(new TasksController());
    server.useController(new RenderTaskAttemptController());
    server.start();
}