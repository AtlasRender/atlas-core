/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Organization from "../entities/Organization";
import RenderTask from "../entities/RenderTask";
import RenderJobLog from "../entities/RenderJobLog";
import Plugin from "../entities/Plugin";
import {Moment} from "moment";


export default interface RenderJobFields {
    id?: number;
    attempts_per_task_limit: number;
    name: string;
    description?: string;
    organization: Organization[];
    renderTasks: RenderTask[];
    logs: RenderJobLog[];
    plugins: Plugin[];
    createdAt: Moment;
    updatedAt: Moment;
}
