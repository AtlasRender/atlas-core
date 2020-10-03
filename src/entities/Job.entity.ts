/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 30.09.20, 23:02
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * JobEntity - typeorm entity for job data.
 * @class
 * @author Denis Afendikov
 */
@Entity("job")
export default class JobEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "name"})
    name: string;

}