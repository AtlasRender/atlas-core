/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/22/20, 5:17 PM
 * All rights reserved.
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
}