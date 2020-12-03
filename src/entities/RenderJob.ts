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

    /**
     * attempts_per_task_limit - This value means quantity of tries to process task.
     * If fails count is greater than this limit - task will not be queued again automatically.
     */
    @Column({default: 1})
    attempts_per_task_limit: number;

    /**
     * name - job name.
     */
    @Column({nullable: false})
    name: string;

    /**
     * description - job description.
     */
    @Column({type: "text"})
    description: string;

    /**
     * frameRange - frame range structure.
     * It contains information about frames to render and reordering information.
     */
    @Column({type: "jsonb", nullable: false})
    frameRange: Array<object>;

    /**
     * failed - displays state of the job.
     */
    @Column({default: false})
    failed: boolean;

    /**
     * pendingTasks - quantity of pending tasks.
     */
    @Column({default: 0})
    pendingTasks: number;

    /**
     * processingTasks - quantity of tasks, that are currently processing.
     */
    @Column({default: 0})
    processingTasks: number;

    /**
     * doneTasks - quantity of done tasks.
     */
    @Column({default: 0})
    doneTasks: number;

    /**
     * failedTasks - quantity of failed tasks.
     */
    @Column({default: 0})
    failedTasks: number;

    /**
     * pluginSettings - plugin settings payload, validated by plugin rules.
     * Will be passed to slave plugin.
     */
    @Column({type: "jsonb", nullable: false})
    pluginSettings: object;

    /**
     * organization - the organization this render job belongs to.
     */
    @ManyToOne(type => Organization, organization => organization.jobs)
    organization: Organization;

    /**
     * renderTasks - render tasks. Created using frame range.
     */
    @OneToMany(type => RenderTask, task => task.job, {cascade: true})
    renderTasks: RenderTask[];

    /**
     * logs - render job log.
     */
    @OneToMany(type => RenderJobLog, log => log.renderJob, {cascade: true})
    logs: RenderJobLog[];

    /**
     * plugin - plugin, used by render job. Will be passed to slave.
     */
    @ManyToOne(type => Plugin, plugin => plugin.renderJobs)
    plugin: Plugin;

    /**
     * submitter - user, who has submitted the job.
     */
    @ManyToOne(type => User, user => user.jobs)
    submitter: User;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
