/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/6/21, 1:55 PM
 * All rights reserved.
 */

import JSONObject from "../JSONObject";


/**
 * SlaveMessage - interface for slave income messages.
 * @interface
 * @author Danil Andreev
 */
export default interface SlaveMessage<T = JSONObject> extends JSONObject {
    /**
     * type - report type.
     */
    type: "report" | "taskStart" | "taskFinish";
    /**
     * payload - report payload. Can contain additional information.
     */
    payload?: T;
    /**
     * slaveId - slave identifier.
     */
    slaveId?: number;
}
