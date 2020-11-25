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

    /**
     * name - a name of the role.
     */
    @Column()
    name: string;

    /**
     * description - description of the role.
     */
    @Column({nullable: true})
    description: string;

    /**
     * color - role color. Used to make it more easy for users to determine role visually.
     */
    @Column({default: "black"})
    color: string;

    /**
     * permissionLevel - this value means the roles order when some abilities are same.
     * For example, user with the highest permissionLevel of 1 and ability of roles management can not change role
     * for user with permissionLevel 2.
     */
    @Column({default: 0})
    permissionLevel: number;

    /**
     * canManageUsers - if true, user with this role can manage organization members.
     */
    @Column({nullable: true, default: false})
    canManageUsers: boolean;

    /**
     * canCreateJobs - if true, user with this role can create render jobs.
     */
    @Column({nullable: true, default: false})
    canCreateJobs: boolean;

    /**
     * canEditJobs - if true, user with this role can edit render jobs.
     */
    @Column({nullable: true, default: false})
    canEditJobs: boolean;

    /**
     * canDeleteJobs - if true, user with this role can delete render jobs.
     */
    @Column({nullable: true, default: false})
    canDeleteJobs: boolean;

    /**
     * canManageRoles - if true, user with this role can manage organization roles.
     */
    @Column({nullable: true, default: false})
    canManageRoles: boolean;

    /**
     * canManagePlugins - if true, user with this role can manage organization plugins.
     */
    @Column({nullable: true, default: false})
    canManagePlugins: boolean;

    /**
     * canManagePlugins - if true, user with this role can manage organization teams.
     */
    @Column({nullable: true, default: false})
    canManageTeams: boolean;

    /**
     * canManagePlugins - if true, user with this role can edit organization audit.
     */
    @Column({nullable: true, default: false})
    canEditAudit: boolean;

    /**
     * organization - an organization this role belongs to.
     */
    @ManyToOne(
        type => Organization, organization => organization.roles,
        {onDelete: "CASCADE", nullable: false}
    )
    organization: Organization;

    /**
     * users - users with this role.
     */
    @ManyToMany(type => User, user => user.roles)
    users: User[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
