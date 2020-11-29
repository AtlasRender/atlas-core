/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/27/20, 3:59 PM
 * All rights reserved.
 */

import * as WS from "ws";


/**
 * WebSocketSession - interface for storing user web socket sessions.
 * @interface
 * @author Danil Andreev
 */
export default interface WebSocketSession {
    /**
     * uid - unique identifier for web socket session.
     */
    uid: string;
    /**
     * userId - session user id.
     */
    userId: number;
    /**
     * ws - web socket session.
     */
    ws: WS;
}
