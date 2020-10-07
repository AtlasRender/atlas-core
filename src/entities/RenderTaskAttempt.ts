/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 15:51
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
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

    @Column()
    slave: number;

    @Column({type: "varchar", default: 50})
    status: string;

    @ManyToOne(type => RenderTask, renderTask => renderTask.renderTaskAttempts)
    task: RenderTask;

    @OneToMany(type => RenderTaskAttemptLog, log => log.renderTaskAttempt)
    logs: RenderTaskAttemptLog[];

    @Column({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Moment;

    @Column({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    updatedAt: Moment;
}