/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 22.02.2021, 22:45
 * All rights reserved.
 */

import ClientWS from "../../src/core/ClientWS";
import WebSocket = require("ws");

jest.mock("../../src/core/Logger");

describe("core -> ClientWS", () => {
    test("Test simple message", async () => {
        // const opts = {
        //     port: 3003
        // };
        // const webSocketServer = new ClientWS(opts);
        // const client = new WebSocket(`ws://localhost:${opts.port}`);
        //
        //
        // webSocketServer.close();
    });
});