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
import RenderTaskAttempt from "./RenderTaskAttempt";
import {Moment} from "moment";

/**
 * RenderTaskAttemptLog - typeorm entity for task attempt log data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class RenderTaskAttemptLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * data - log data.
     */
    @Column({type: "jsonb"})
    data: any;

    /**
     * type - a type of the record. Needs to correctly interpret data.
     */
    @Column({type: "varchar", default: 50})
    type: string;

    /**
     * renderTaskAttempt - render task attempt this log record belongs to.
     */
    @ManyToOne(type => RenderTaskAttempt, attempt => attempt.logs, {onDelete: "CASCADE"})
    renderTaskAttempt: RenderTaskAttempt;

    @CreateDateColumn()
    createdAt: Moment;
}
