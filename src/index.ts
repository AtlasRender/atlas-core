/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import "./globals";
import {config} from "./config";
import envDispatcher from "./envDispatcher";
import SystemConfig from "./core/SystemConfig";

const options: SystemConfig.Options = {
    envMask: /ATLAS_(.+)/,
    additionalConfigs: [
        config
    ],
    envDispatcher
};
const sysConfig = new SystemConfig(options);

import main from "./main";
main().then();


