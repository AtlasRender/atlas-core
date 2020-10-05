/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 18:45
 * All rights reserved.
 */


import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Timestamp} from "typeorm";
import Role from "./Role";
import Organization from "./Organization";


/**
 * Plugin - typeorm entity for user data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class Plugin extends BaseEntity {

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
    script: any;

    @Column({type: "text"})
    note: any;

    @Column()
    deleted: boolean;

    @ManyToOne(type => Organization, org => org.plugins)
    organization: Organization;

    @ManyToMany(type => Role, role => role.users)
    @JoinTable()
    roles: Role[];

    @Column({type: "timestamp"})
    created_at: Timestamp;

    @Column({type: "timestamp"})
    updated_at: Timestamp;
}