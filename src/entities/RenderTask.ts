/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 15:40
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import RenderJob from "./RenderJob";
import RenderTaskAttempt from "./RenderTaskAttempt";

/**
 * RenderTask - typeorm entity for render task data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class RenderTask extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    frame: number;

    @Column({type: "varchar", default: 50})
    status: string;

    @ManyToOne(type => RenderJob, job => job.renderTasks)
    job: RenderJob;

    @OneToMany(type => RenderTaskAttempt, attempt => attempt.task)
    renderTaskAttempts: RenderTaskAttempt[];

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: Timestamp;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Timestamp;
}