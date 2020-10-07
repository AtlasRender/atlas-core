/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 07.10.2020, 14:52
 * All rights reserved.
 */

import {Moment} from "moment";

/**
 * OutUser - user data that will be returned from endpoints.
 * @interface
 * @author Denis Afendikov
 */
export default interface OutUser {
    id: number;
    username: string;
    email: string;
    deleted: boolean;
    bearer: string;
    createdAt: Moment;
    updatedAt: Moment;
}