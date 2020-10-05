/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 30.09.20, 23:02
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import Organization from "./Organization";
import RenderTask from "./RenderTask";
import RenderJobLog from "./RenderJobLog";

/**
 * Job - typeorm entity for job data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class RenderJob extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    attempts_per_task_limit: number;

    @Column()
    name: string;

    @ManyToOne(type => Organization, organization => organization.jobs)
    organization: Organization[];

    @OneToMany(type => RenderTask, task => task.job)
    renderTasks: RenderTask[];

    @OneToMany(type => RenderJobLog, log => log.renderJob)
    logs: RenderJobLog[];

    @Column({type: "timestamp"})
    created_at: Timestamp;

    @Column({type: "timestamp"})
    updated_at: Timestamp;
}