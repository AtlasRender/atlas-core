/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 20.02.2021, 23:14
 * All rights reserved.
 */

import Server from "../../src/core/Server";
import Authenticator from "../../src/core/Authenticator";

jest.mock("../../src/core/Server");
jest.mock("../../src/core/Logger");
// jest.mock("redis");

/* eslint @typescript-eslint/ban-ts-comment: 0 */

describe("core -> Authenticator", () => {
    test("Authenticator -> getKey() -> key is present", async () => {
        const redisKey = "superduperkey";
        Server.getCurrent = jest.fn(() => {
            return {
                getRedis: () => ({
                    get: (key, cb) => {
                        console.log(`Invoked GET by Redis by key '${key}'`);
                        cb(null, redisKey);
                    }
                })
            } as unknown as Server;
        });
        expect(redisKey).toEqual(await Authenticator.getKey());
    });

    test("Authenticator -> getKey() -> key is NOT present", async () => {
        const redisStorage = {};
        let accessedKey;
        Server.getCurrent = jest.fn(() => {
            return {
                getRedis: () => ({
                    get: (key, cb) => {
                        console.log(`Invoked GET by Redis by key '${key}'`);
                        cb(new Error(), null);
                    },
                    set: (key, val) => {
                        console.log(`Invoked SET by Redis by key '${key}'`);
                        accessedKey = key;
                        redisStorage[key] = val;
                    }
                })
            } as unknown as Server;
        });
        expect(await Authenticator.getKey()).toEqual(redisStorage[accessedKey]);
    });
});