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
 * Temp - typeorm entity for temporary data.
 * @class
 * @author Danil Andreev
 */
@Entity()
export default class Temp extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * data - binary data of the file.
     */
    @Column({type: "bytea"})
    data: Buffer;

    /**
     * meta - file metadata. Can contain additional information. Used to restrict file size.
     */
    @Column({type: "json", nullable: true})
    meta: any;

    /**
     * isPublic - if true, file can be used by everybody.
     */
    @Column({default: false})
    isPublic: boolean;

    /**
     * owner - file creator.
     */
    @ManyToOne(type => User, user => user.temp, {onDelete: "CASCADE"})
    owner: User;

    @CreateDateColumn()
    createdAt: Moment;
}
