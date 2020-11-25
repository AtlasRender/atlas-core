/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
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

    /**
     * name - plugin name. Must be unique per organization.
     */
    @Column()
    name: string;

    /**
     * version - plugin version. Must be unique per plugin name.
     */
    @Column()
    version: string;

    /**
     * description - Plugin description. Just plain text.
     */
    @Column({type: "text", nullable: true})
    description: string;

    /**
     * rules - rules for plugin additional settings. Validated by PluginSettingsSpec class.
     * The rules gives structure of plugin additional settings. Rules describes fields layout and type.
     * @type PluginSettingsSpec
     */
    @Column({type: "jsonb"})
    rules: any;

    /**
     * extraData - extra data for plugin.
     */
    @Column({type: "jsonb", nullable: true})
    extraData: any;

    /**
     * script - the text of the JS script to execute on slave.
     */
    @Column({type: "text"})
    script: string;

    /**
     * note - note for the plugin. Can be filled by person, who adds plugin to organization. Can be changed whenever.
     */
    @Column({type: "text", nullable: true})
    note: string;

    /**
     * readme - readme file text in markdown notation.
     * Can contain additional info about plugin with images and other data.
     */
    @Column({type: "text", nullable: true})
    readme: string;

    /**
     * deleted - if true, plugin will not be displayed. After some time it can be deleted from database.
     */
    @Column({default: false})
    deleted: boolean;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
