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
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
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

    @Column({nullable: true, default: false})
    canManageUsers: boolean;

    @Column({nullable: true, default: false})
    canCreateJobs: boolean;

    @Column({nullable: true, default: false})
    canEditJobs: boolean;

    @Column({nullable: true, default: false})
    canDeleteJobs: boolean;

    @Column({nullable: true, default: false})
    canManageRoles: boolean;

    @Column({nullable: true, default: false})
    canManagePlugins: boolean;

    @Column({nullable: true, default: false})
    canManageTeams: boolean;

    @Column({nullable: true, default: false})
    canEditAudit: boolean;

    @ManyToOne(type => Organization, organization => organization.roles,
        {onDelete: "CASCADE", nullable: false})
    organization: Organization;

    @ManyToMany(type => User, user => user.roles)
    users: User[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
