/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import Organization from "./Organization";
import {Moment} from "moment";


/**
 * SystemLog - typeorm entity for system log data.
 * @class
 * @author Danil Andreev
 */
@Entity()
export default class SystemLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 30})
    level: string;

    @Column({type: "json"})
    payload: object;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
