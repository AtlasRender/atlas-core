/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 13.11.2020, 20:11
 * All rights reserved.
 */

import Controller from "../../src/core/Controller";
import LoginController from "../../src/controllers/LoginController";
import * as request from 'supertest'
import Server from "../../src/core/Server";
import {config} from "../../src/config";
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
