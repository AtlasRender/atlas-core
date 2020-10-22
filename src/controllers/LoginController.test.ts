/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10.10.2020, 23:17
 * All rights reserved.
 */

import Controller from "../core/Controller";
import LoginController from "./LoginController";
import * as request from 'supertest'
import Server from "../core/Server";
import {config} from "../config";
// import {server} from "../index";

describe("controllers -> LoginController", () => {
    let server: Server;
    beforeAll(async () => {
        server = await Server.createServer(config);
        server.useController(new LoginController());
        server.start();
    });

    test("Test if controller is instance of Controller", () => {
        const controller: LoginController = new LoginController();
        expect(controller instanceof Controller).toBe(true);
    });

    test("Test without body", async (done) => {
        const res = await request(server.callback()).post("/login");
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.response.name).toBe("AJV_INVALID_PAYLOAD");
        done();
    });

    afterAll((done) => {
        server.close();
        done();
    });
});
