/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 30.09.20, 23:00
 * All rights reserved.
 */

import {
    BaseEntity,
    Column,
    Entity,
    IsNull,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    Timestamp,
    Unique
} from "typeorm";
import Role from "./Role";
import Organization from "./Organization";


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

    @Column({default: ""})
    bearer: string;

    @Column({default: false})
    deleted: boolean;

    @ManyToMany(type => Organization, org => org.users)
    @JoinTable({
        name: "user_organizations"
    })
    organizations: Organization[];

    @ManyToMany(type => Role, role => role.users)
    @JoinTable({
        name: "user_roles"
    })
    roles: Role[];

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: Timestamp;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Timestamp;
}