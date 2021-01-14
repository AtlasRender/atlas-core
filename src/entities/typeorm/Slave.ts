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
    Entity, Index,
    ManyToMany,
    PrimaryGeneratedColumn, Unique,
    UpdateDateColumn
} from "typeorm";
import Organization from "./Organization";
import {Moment} from "moment";

/**
 * Slave - typeorm entity for slave data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
@Unique(["token"])
export default class Slave extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * name - a name of the slave.
     */
    @Column()
    name: string;

    /**
     * description - a description of the slave.
     */
    @Column("text")
    description: string;

    /**
     * Slave token for authorization.
     */
    @Index()
    @Column("uuid")
    token: string;

    /**
     * organization - organization, this slave belongs to.
     */
    // TODO: change to many to one relation!
    @ManyToMany(type => Organization, org => org.slaves)
    organizations: Organization[];

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
