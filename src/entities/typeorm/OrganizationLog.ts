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
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import Organization from "./Organization";
import {Moment} from "moment";


/**
 * OrganizationLog - typeorm entity for organization log data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class OrganizationLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * data - log data.
     */
    @Column({type: "jsonb"})
    data: any;

    /**
     * type - record type. Need to correctly interpret data.
     */
    @Column({type: "varchar", default: 50})
    type: string;

    /**
     * organization - organization that this log record belongs to.
     */
    @ManyToOne(type => Organization, org => org.logs)
    organization: Organization;

    @CreateDateColumn()
    createdAt: Moment;

    @UpdateDateColumn()
    updatedAt: Moment;
}
