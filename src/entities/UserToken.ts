/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 15.10.2020, 21:07
 * All rights reserved.
 */

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Moment} from "moment";
import User from "./User";


/**
 * User - typeorm entity for user data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class UserToken extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    token: string;

    @ManyToOne(type => User, user => user.tokens)
    user: User;

    @CreateDateColumn()
    createdAt: Moment;
}