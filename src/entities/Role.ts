/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 16:15
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import Organization from "./Organization";
import User from "./User";


/**
 * Role - typeorm entity for roles data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    color: string;

    @Column()
    permission_level: number;

    @ManyToOne(type => Organization, organization => organization.roles)
    organization: Organization;

    @ManyToMany(type => User, user => user.roles)
    users: User;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: Timestamp;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Timestamp;
}