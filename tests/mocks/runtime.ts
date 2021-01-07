/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 07.01.2021, 10:59
 * All rights reserved.
 */

import Server from "../../src/core/Server";
import {config} from "../../src/config";
import LoginController from "../../src/controllers/LoginController";


export default async function () {
    global.__server__ = await Server.createServer(config);
}