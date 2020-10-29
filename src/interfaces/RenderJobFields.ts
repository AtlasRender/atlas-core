/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 22.10.2020, 20:03
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
