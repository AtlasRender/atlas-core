/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 14:45
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import User from "./User";
import RenderJob from "./RenderJob";

/**
 * Organization - typeorm entity for organization data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class Organization extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    default_role_id: number;

    @Column()
    name: string;

    @Column({type: "text"})
    description: string;

    @OneToOne(type => User)
    @JoinColumn()
    owner_user: User;

    @OneToMany(type => RenderJob, job => job.organization)
    jobs: RenderJob[];

    @Column({type: "timestamp"})
    created_at: Timestamp;

    @Column({type: "timestamp"})
    updated_at: Timestamp;
}