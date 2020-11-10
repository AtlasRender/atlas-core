/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 16:06
 * All rights reserved.
 */

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import RenderJob from "./RenderJob";
import {Moment} from "moment";

/**
 * RenderJobLog - typeorm entity for job log data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class RenderJobLog extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "jsonb"})
    data: any;

    @Column({type: "varchar", default: 50})
    type: string;

    @ManyToOne(type => RenderJob, job => job.logs, {onDelete: "CASCADE"})
    renderJob: RenderJob;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
