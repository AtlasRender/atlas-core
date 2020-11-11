/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 18:50
 * All rights reserved.
 */

import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Moment} from "moment";

/**
 * BasicPlugin - Base class for plugin entities.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class BasicPlugin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    version: string;

    @Column({type: "text", nullable: true})
    description: string;

    @Column({type: "jsonb"})
    rules: any;

    @Column({type: "jsonb", nullable: true})
    extraData: any;

    @Column({type: "text"})
    script: string;

    @Column({type: "text", nullable: true})
    note: string;

    @Column({default: false})
    deleted: boolean;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
