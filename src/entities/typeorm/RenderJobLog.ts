/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
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

    /**
     * data - log data.
     */
    @Column({type: "jsonb"})
    data: any;

    /**
     * type - type of log record. Used to correctly interpret data.
     */
    @Column({type: "varchar", default: 50})
    type: string;

    /**
     * renderJob - render job this log belongs to.
     */
    @ManyToOne(type => RenderJob, job => job.logs, {onDelete: "CASCADE"})
    renderJob: RenderJob;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
