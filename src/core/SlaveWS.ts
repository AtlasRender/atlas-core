/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/28/20, 1:55 PM
 * All rights reserved.
 */

import * as WS from "ws";


export default class SlaveWS extends WS.Server {
    public static instance: SlaveWS;
}
