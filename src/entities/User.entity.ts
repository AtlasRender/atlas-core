/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 30.09.20, 23:00
 * All rights reserved.
 */

import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


/**
 * UserEntity - typeorm entity for user data.
 * @class
 * @author Denis Afendikov
 */
@Entity("user")
export default class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "username"})
    username: string;

    @Column({name: "email"})
    email: string;

    @Column({name: "password"})
    password: string;

}