/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import RenderJob from "../entities/typeorm/RenderJob";
import RenderTaskAttempt from "../entities/typeorm/RenderTaskAttempt";
import {Moment} from "moment";


export default interface RenderTaskFields {
    id?: number;
    frame: number;
    status: string;
    job: RenderJob;
    renderTaskAttempts: RenderTaskAttempt[];
    createdAt: Moment;
    updatedAt: Moment;
}
