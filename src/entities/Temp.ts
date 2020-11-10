/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: atlas-core
 * File last modified: 11/10/20, 4:29 PM
 * All rights reserved.
 */

import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import BasicPlugin from "./BasicPlugin";
import {Moment} from "moment";
import User from "./User";


/**
 * Temp - typeorm entity for temporary data.
 * @class
 * @author Danil Andreev
 */
@Entity()
export default class Temp extends BasicPlugin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "blob"})
    data: Buffer;

    @Column({type: "json", nullable: true})
    meta: any;

    @CreateDateColumn()
    createdAt: Moment;

    @ManyToOne(type => User, user => user.temp, {onDelete: "CASCADE"})
    owner: User;
}
