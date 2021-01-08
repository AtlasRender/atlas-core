/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/6/21, 2:28 PM
 * All rights reserved.
 */

export default {
    $id: "SlaveWS_responsePayloadTaskReportSchema",
    required: ["taskId"],
    properties: {
        taskId: {
            type: "integer",
        },
        message: {
            type: "string",
        },
        progress: {
            type: "integer",
            min: 0,
            max: 100,
        }
    }
};
