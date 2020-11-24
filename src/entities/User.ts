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
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import Role from "./Role";
import Organization from "./Organization";
import {Moment} from "moment";
import UserToken from "./UserToken";
import Temp from "./Temp";
import RenderJob from "./RenderJob";


/**
 * User - typeorm entity for user data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({default: false})
    deleted: boolean;

    @ManyToMany(type => Organization, org => org.users)
    organizations: Organization[];

    @ManyToMany(type => Role, role => role.users)
    @JoinTable({
        name: "user_roles"
    })
    roles: Role[];

    @OneToMany(type => UserToken, tokens => tokens.user)
    tokens: UserToken[];

    @OneToMany(type => RenderJob, job => job.submitter)
    jobs: RenderJob[];

    @OneToMany(type => Temp, temp => temp.owner, {cascade: true})
    temp: Temp[];

    // @Column({
    //     name: "created_at",
    //     type: "timestamp",
    //     default: () => "CURRENT_TIMESTAMP"
    // })
    // createdAt: Moment;
    //
    // @Column({
    //     name: "updated_at",
    //     type: "timestamp",
    //     default: () => "CURRENT_TIMESTAMP",
    //     onUpdate: "CURRENT_TIMESTAMP"
    // })
    // updatedAt: Moment;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
