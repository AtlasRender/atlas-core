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
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import RenderTask from "./RenderTask";
import RenderTaskAttemptLog from "./RenderTaskAttemptLog";
import {Moment} from "moment";

/**
 * RenderTaskAttempt - typeorm entity for task attempt data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class RenderTaskAttempt extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * slaveUID - UID of the slave, that processing this attempt.
     */
    @Column({length: 100})
    slaveUID: string;

    /**
     * status - render task attempt status.
     * @type "done" | "failed" | "processing"
     */
    @Column({type: "varchar", default: 50})
    status: string;

    /**
     * task - render task this attempt belongs to.
     */
    @ManyToOne(type => RenderTask, renderTask => renderTask.renderTaskAttempts, {onDelete: "CASCADE"})
    task: RenderTask;

    /**
     * logs - render task attempt log. Here will be stored all log records from the slave.
     */
    @OneToMany(type => RenderTaskAttemptLog, log => log.renderTaskAttempt, {cascade: true})
    logs: RenderTaskAttemptLog[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
