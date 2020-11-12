/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import {Moment} from "moment";


/**
 * JobEventable - basic interface for job events.
 * @interface
 * @author Danil Andreev
 */
export default interface JobEventable {
    /**
     * type - event type.
     */
    type: string;
    /**
     * data - event payload.
     */
    data?: any;
    /**
     * message - optional event message.
     */
    message?: string;
    /**
     * createdAt - timestamp of event creation.
     */
    createdAt?: Moment;
}
