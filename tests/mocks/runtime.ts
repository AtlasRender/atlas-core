/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 07.01.2021, 10:59
 * All rights reserved.
 */

import Server from "../../src/core/Server";
import {config} from "../config";
import LoginController from "../../src/controllers/LoginController";
import JobsProcessor from "../../src/processors/JobsProcessor";
import TaskReportsProcessor from "../../src/processors/TaskReportsProcessor";
import UserNotificationProcessor from "../../src/processors/UserNotificationProcessor";
import WebSocket from "../../src/core/WebSocket";
import UsersController from "../../src/controllers/UsersController";
import OrganizationsController from "../../src/controllers/OrganizationsController";
import UserTokensController from "../../src/controllers/UserTokensController";
import JobController from "../../src/controllers/JobController";
import VersionsController from "../../src/controllers/VersionsController";
import UploadController from "../../src/controllers/UploadController";
import PluginController from "../../src/controllers/PluginController";
import TasksController from "../../src/controllers/TasksController";
import RenderTaskAttemptController from "../../src/controllers/RenderTaskAttemptController";

/**
 * This function will be invoked before all test suits.
 */
export default async function() {
    // const server = await Server.createServer(config);
    // await JobsProcessor();
    // await TaskReportsProcessor();
    // await UserNotificationProcessor();
    //
    // const webSocketClient = new WebSocket();
    //
    // server.useController(new UsersController());
    // server.useController(new LoginController());
    // server.useController(new OrganizationsController());
    // server.useController(new UserTokensController());
    // server.useController(new JobController());
    // server.useController(new VersionsController());
    // server.useController(new UploadController());
    // server.useController(new PluginController());
    // server.useController(new TasksController());
    // server.useController(new RenderTaskAttemptController());
    // server.start();
}