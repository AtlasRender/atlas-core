/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/22/20, 5:22 PM
 * All rights reserved.
 */

import JobEventable from "../interfaces/JobEvent";
import {Moment} from "moment";
import moment = require("moment");


/**
 * JobEventType - types for JobEvent type.
 * @author Danil Andreev
 */
export const JobEventType = {
    CREATE_JOB: "create",
}

/**
 * JobEvent - class for render job events.
 * @class
 * @author Danil Andreev
 */
export default class JobEvent implements JobEventable {
    public readonly type: string;
    public data?: any;
    public readonly message?: string;
    public readonly createdAt: Moment;

    /**
     * constructor - Creates an instance of JobEvent.
     * @constructor
     * @param event - input event data.
     * @author Danil Andreev
     */
    constructor(event: JobEventable) {
        this.type = event.type;
        this.data = event.data;
        this.message = event.message;
        this.createdAt = moment();
    }

    public toBuffer() {
        return new Buffer(JSON.stringify({
            type: this.type,
            data: this.data,
            message: this.message,
            createdAt: this.createdAt,
        }));
    }
}
