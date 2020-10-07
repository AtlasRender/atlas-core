/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 18:58
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import Organization from "./Organization";
import RenderTask from "./RenderTask";
import RenderJobLog from "./RenderJobLog";
import Plugin from "./Plugin";

/**
 * Slave - typeorm entity for slave data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class Slave extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column("uuid")
    uuid: string;

    @ManyToMany(type => Organization, org => org.slaves)
    organizations: Organization[];

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: Timestamp;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Timestamp;
}