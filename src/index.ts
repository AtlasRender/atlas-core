/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import "globals";
import * as dotenv from "dotenv";
import {config} from "./config";
dotenv.config();


import SystemOptions from "./core/SystemOptions";
const options: SystemOptions.Options = {
    envMask: /ATLAS.+/,
    additionalConfigs: [
        config
    ],
    envKeyTranslator: (value: string) => value.slice(5)
};
new SystemOptions(options);
//TODO: fix incorrect work with compiled project.
console.log(SystemOptions.config);

import main from "./main";
main().then();


