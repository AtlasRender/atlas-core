/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 16:39
 * All rights reserved.
 */

import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
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

    @Column({type: "jsonb"})
    data: any;

    @Column({type: "varchar", default: 50})
    type: string;

    @ManyToOne(type => Organization, org => org.logs)
    organization: Organization;

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