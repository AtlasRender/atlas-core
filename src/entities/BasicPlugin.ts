/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 18:50
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
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

    @Column({type: "text"})
    description: string;

    @Column({type: "jsonb"})
    rules: any;

    @Column({type: "jsonb"})
    extra_data: any;

    @Column({type: "text"})
    script: string;

    @Column({type: "text"})
    note: string;

    @Column()
    deleted: boolean;

    @Column({
        name: "created_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Moment;

    @Column({
        name: "updated_at",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    updatedAt: Moment;
}