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
import Organization from "./Organization";
import RenderTask from "./RenderTask";
import RenderJobLog from "./RenderJobLog";
import Plugin from "./Plugin";
import {Moment} from "moment";
import User from "./User";

/**
 * RenderJob - typeorm entity for job data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class RenderJob extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    attempts_per_task_limit: number;

    @Column({nullable: false})
    name: string;

    @Column({type: "text"})
    description: string;

    @Column({type: "text", nullable: false})
    frameRange: string;

    @Column({default: false})
    failed: boolean;

    @Column({default: 0})
    pendingTasks: number;

    @Column({default: 0})
    processingTasks: number;

    @Column({default: 0})
    doneTasks: number;

    @Column({default: 0})
    failedTasks: number;

    @Column({type: "jsonb", nullable: false})
    pluginSettings: object;

    @ManyToOne(type => Organization, organization => organization.jobs)
    organization: Organization;

    @OneToMany(type => RenderTask, task => task.job, {cascade: true})
    renderTasks: RenderTask[];

    @OneToMany(type => RenderJobLog, log => log.renderJob, {cascade: true})
    logs: RenderJobLog[];

    @ManyToOne(type => Plugin, plugin => plugin.renderJobs)
    plugin: Plugin;

    @ManyToOne(type => User, user => user.jobs)
    submitter: User;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
