/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 15:40
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
import RenderJob from "./RenderJob";
import RenderTaskAttempt from "./RenderTaskAttempt";
import {Moment} from "moment";

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

    //@Column({nullable: false})
    @ManyToOne(type => RenderJob, job => job.renderTasks, {onDelete: "CASCADE"})
    job: RenderJob;

    @OneToMany(type => RenderTaskAttempt, attempt => attempt.task, {cascade: true})
    renderTaskAttempts: RenderTaskAttempt[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}