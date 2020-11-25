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
    Entity, JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import Role from "./Role";
import Organization from "./Organization";
import {Moment} from "moment";
import UserToken from "./UserToken";
import Temp from "./Temp";
import RenderJob from "./RenderJob";
import UserPrivateData from "./UserPrivateData";


/**
 * User - typeorm entity for user data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /**
     * username - username of the user. Must be unique.
     */
    @Column({unique: true})
    username: string;

    /**
     * email - e-mail of the user. Must be unique. Can be used to log in.
     */
    @Column({unique: true})
    email: string;

    /**
     * deleted - if true, user will be displayed as deleted.
     * Nobody can log into deleted account.
     */
    @Column({default: false})
    deleted: boolean;

    @OneToOne(type => UserPrivateData, data => data.user, {nullable: true})
    @JoinColumn()
    privateData: UserPrivateData;

    /**
     * organizations - organizations this user is member in.
     */
    @ManyToMany(type => Organization, org => org.users)
    organizations: Organization[];

    /**
     * roles - roles of the user in different organizations.
     * Roles can grant access to different abilities into organization.
     */
    @ManyToMany(type => Role, role => role.users)
    @JoinTable({
        name: "user_roles"
    })
    roles: Role[];

    /**
     * tokens - user access tokens. Can be used for CI or something else.
     */
    @OneToMany(type => UserToken, tokens => tokens.user)
    tokens: UserToken[];

    /**
     * jobs - render jobs, submitted by this user.
     */
    @OneToMany(type => RenderJob, job => job.submitter)
    jobs: RenderJob[];

    /**
     * temp - temporary files of the user.
     */
    @OneToMany(type => Temp, temp => temp.owner, {cascade: true})
    temp: Temp[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
