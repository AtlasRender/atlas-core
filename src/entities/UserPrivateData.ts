/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 25.11.2020, 19:08
 * All rights reserved.
 */

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne, OneToOne, PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Moment} from "moment";
import User from "./User";


/**
 * UserPrivateData - typeorm entity for user private data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class UserPrivateData extends BaseEntity {
    @PrimaryColumn({
        name: "userId",
        nullable: false,
    })
    userId: number;

    /**
     * user - relation to user, which private data is stored
     */
    @OneToOne(type => User, user => user.privateData, {nullable: false})
    @JoinColumn({
        name: "userId"
    })
    user: User;

    /**
     * password - encrypted user password.
     */
    @Column()
    password: string;
}
