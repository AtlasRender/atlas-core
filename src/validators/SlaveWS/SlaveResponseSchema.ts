/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/6/21, 2:27 PM
 * All rights reserved.
 */

export default {
    $id: "SlaveWS_responseSchema",
    required: ["type"],
    properties: {
        type: {
            type: "string",
            enum: [
                "report",
                "taskStart",
                "taskFinish"
            ]
        },
        payload: {
            type: "object"
        }
    },
    type: "object",
};
