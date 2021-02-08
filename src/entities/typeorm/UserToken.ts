/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Moment} from "moment";
import User from "./User";


/**
 * UserToken - typeorm entity for user tokens.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class UserToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * name - a name of the token.
     */
    @Column()
    name: string;

    /**
     * description - description of the token.
     */
    @Column()
    description: string;

    /**
     * token - token value.
     */
        // TODO: store encrypted!!!
    @Column()
    token: string;

    /**
     * user - user, this token belongs to.
     */
    @ManyToOne(type => User, user => user.tokens)
    user: User;

    @CreateDateColumn()
    createdAt: Moment;
}
