/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 30.09.2020, 20:07
 * All rights reserved.
 */

import Server from "./core/Server";


const server = new Server({controllersDir: __dirname + "\\controllers\\**\\*"});
server.start(3003)

// import {createConnection, Connection, getManager} from "typeorm";
// import CustomerEntity from "./entities/Customer.entity";
// async function DB_connect() {
//     const connection: Connection = await createConnection({
//         type: "mysql",
//         host: "localhost",
//         port: 3306,
//         username: "root",
//         password: "",
//         database: "afendikov_db",
//         entities: [__dirname + "/entities/*.entity.ts"]
//     });
//     const customers = await getManager().getRepository(CustomerEntity)
//         .createQueryBuilder("customer")
//         .select()
//         .getMany();
//     console.log(customers);
//     return connection;
// }
//
// const connection = DB_connect().then();


