/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import BasicPlugin from "./BasicPlugin";
import {Moment} from "moment";
import User from "./User";


/**
 * Temp - typeorm entity for temporary data.
 * @class
 * @author Danil Andreev
 */
@Entity()
export default class Temp extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "bytea"})
    data: Buffer;

    @Column({type: "json", nullable: true})
    meta: any;

    @Column({default: false})
    isPublic: boolean;

    @CreateDateColumn()
    createdAt: Moment;

    @ManyToOne(type => User, user => user.temp, {onDelete: "CASCADE"})
    owner: User;
}
