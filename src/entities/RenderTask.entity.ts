/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 15:40
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import Job from "./Job.entity";
import RenderTaskAttempt from "./RenderTaskAttempt.entity";

/**
 * RenderTask - typeorm entity for render task data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class RenderTask extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Job, job => job.renderTasks)
    job: Job;

    @OneToMany(type => RenderTaskAttempt, attempt => attempt.task)
    renderTaskAttempts: RenderTaskAttempt[];

    @Column()
    frame: number;

    @Column({type: "varchar", default: 50})
    status: string;

    @Column({type: "timestamp"})
    created_at: Timestamp;

    @Column({type: "timestamp"})
    updated_at: Timestamp;
}