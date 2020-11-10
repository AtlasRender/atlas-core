/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 18:45
 * All rights reserved.
 */

import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Organization from "./Organization";
import BasicPlugin from "./BasicPlugin";
import RenderJob from "./RenderJob";
import {Moment} from "moment";


/**
 * Plugin - typeorm entity for plugin data.
 * @class
 * @author Danil Andreev
 */
@Entity()
export default class Plugin extends BasicPlugin {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Organization, org => org.plugins)
    organization: Organization;

    @OneToMany(type => RenderJob, job => job.plugins)
    renderJob: RenderJob;

    @Column({type: "blob"})
    plugin: Buffer;

    @Column({type: "json"})
    settings: any;

    @CreateDateColumn()
    createdAt: Moment;
}