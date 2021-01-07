/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 07.01.2021, 11:19
 * All rights reserved.
 */

import Server from "./src/core/Server";


declare global {
    namespace NodeJS {
        interface Global {
            __server__: Server,
        }
    }
}
