/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 14:45
 * All rights reserved.
 */

import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";
import RenderJob from "./RenderJob";
import Role from "./Role";
import OrganizationLog from "./OrganizationLog";
import Plugin from "./Plugin";
import Slave from "./Slave";
import {Moment} from "moment";

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

    @Column({unique: true})
    name: string;

    @Column({type: "text"})
    description: string;

    @OneToOne(type => User)
    @JoinColumn()
    owner_user: User;

    @OneToOne(type => Role)
    @JoinColumn()
    default_role: Role;

    @ManyToMany(type => User, user => user.organizations)
    users: User[];

    @ManyToMany(type => Slave, slave => slave.organizations)
    @JoinTable({
        name: "slaves_pool"
    })
    slaves: Slave[];

    @OneToMany(type => RenderJob, job => job.organization)
    jobs: RenderJob[];

    @OneToMany(type => Role, role => role.organization)
    roles: Role[];

    @OneToMany(type => OrganizationLog, log => log.organization)
    logs: OrganizationLog[];

    @OneToMany(type => Plugin, plugin => plugin.organization)
    plugins: Plugin[];

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