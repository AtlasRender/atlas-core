/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 30.09.20, 22:25
 * All rights reserved.
 */

import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

/**
 * CustomerEntity - typeorm entity for customers table (not used)
 * @class
 * @author Denis Afendikov
 */
@Entity("customer")
export default class CustomerEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "customer_name"})
    customerName: string;

    @Column({name: "email"})
    email: string;

    @Column({name: "address"})
    address: string;

    @Column({name: "bank_details"})
    bankDetails: number;


}