/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 22.10.2020, 20:18
 * All rights reserved.
 */

import {Column, CreateDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import RenderJob from "../entities/RenderJob";
import RenderTaskAttempt from "../entities/RenderTaskAttempt";
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
