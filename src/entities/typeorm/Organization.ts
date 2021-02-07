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
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
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

    /**
     * name - name - organization name. Must be unique.
     */
    @Column({unique: true})
    name: string;

    /**
     * description - organization description.
     */
    @Column({type: "text", nullable: true})
    description: string;

    /**
     * ownerUser - the owner of the organization.
     */
    @ManyToOne(type => User)
    ownerUser: User;

    /**
     * defaultRole - default role in the organization. Will be assigned by default for all newcomers.
     */
    @OneToOne(type => Role, {nullable: true})
    @JoinColumn()
    defaultRole: Role;

    /**
     * users - organization members.
     */
    @ManyToMany(type => User, user => user.organizations)
    @JoinTable({
        name: "user_organizations"
    })
    users: User[];

    /**
     * slaves - slaves, connected to this organization.
     */
    @OneToMany(type => Slave, slave => slave.organizations)
    slaves: Slave[];

    /**
     * jobs - all render jobs, that belongs to this organization.
     */
    @OneToMany(type => RenderJob, job => job.organization)
    jobs: RenderJob[];

    /**
     * roles - all roles in organization. Roles can be assigned to members to give rights for doing something.
     */
    @OneToMany(type => Role, role => role.organization)
    roles: Role[];

    /**
     * logs - organization log.
     */
    @OneToMany(type => OrganizationLog, log => log.organization)
    logs: OrganizationLog[];

    /**
     * plugins - plugins, that the organization contains.
     */
    @OneToMany(type => Plugin, plugin => plugin.organization)
    plugins: Plugin[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
