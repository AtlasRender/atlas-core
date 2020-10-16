/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 16:15
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Organization from "./Organization";
import User from "./User";
import {Moment} from "moment";


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

    @Column({nullable: true})
    description: string;

    @Column({
        default: "black"
    })
    color: string;

    @Column({
        default: 0
    })
    permissionLevel: number;

    @ManyToOne(type => Organization, organization => organization.roles)
    organization: Organization;

    @ManyToMany(type => User, user => user.roles)
    users: User[];

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