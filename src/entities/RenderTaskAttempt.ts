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

    @Column({length: 100})
    slaveUID: string;

    @Column({type: "varchar", default: 50})
    status: string;

    @ManyToOne(type => RenderTask, renderTask => renderTask.renderTaskAttempts, {onDelete: "CASCADE"})
    task: RenderTask;

    @OneToMany(type => RenderTaskAttemptLog, log => log.renderTaskAttempt, {cascade: true})
    logs: RenderTaskAttemptLog[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
