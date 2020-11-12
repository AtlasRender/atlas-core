/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
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
