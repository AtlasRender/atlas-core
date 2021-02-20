/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 13.11.2020, 20:11
 * All rights reserved.
 */

import Controller from "../../src/core/Controller";
import LoginController from "../../src/controllers/LoginController";
import User from "../../src/entities/typeorm/User";
import {mocked} from "ts-jest/utils";
import {Context} from "koa";
import * as argon2 from "argon2";
import Authenticator from "../../src/core/Authenticator";
import RequestError from "../../src/errors/RequestError";


jest.mock("../../src/entities/typeorm/User");
jest.mock("../../src/core/Authenticator");

describe("controllers -> LoginController", () => {
    const controllerInstance = new LoginController();

    beforeEach(() => {
        mocked(User).mockClear();
    });

    test("Test if controller is instance of Controller", () => {
        expect(controllerInstance).toBeInstanceOf(Controller);
    });

    test("Test simple successful login", async () => {
        // mocking Authenticator module to return prepared string as bearer
        const resultBearer = "bearerbearerbearer";
        mocked(Authenticator).createJwt.mockReturnValue(new Promise((res, rej) => {
            res(resultBearer);
        }));

        // login data used in context AND returned by User mock
        const loginData = {
            username: "test",
            password: "password"
        };
        const hashedPassword = await argon2.hash(loginData.password);
        // data that will be returned from User.findOne mock
        const resultUser = {
            id: 0,
            username: loginData.username,
            email: "blabla@gmail.com",
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            bearer: await Authenticator.createJwt({id: 0, username: loginData.username}),
        };
        mocked(User).findOne.mockReturnValueOnce(new Promise((res, rej) => {
            res({
                ...resultUser,
                username: loginData.username,
                privateData: {
                    password: hashedPassword
                }
            } as unknown as User);
        }));

        const ctx: Context = {
            request: {
                body: {
                    ...loginData
                }
            },
            body: {}
        } as Context;
        await controllerInstance.loginHandler(ctx);
        expect(ctx.body).toEqual(resultUser);
    });

    test("Test login -> invalid username", async () => {
        // login data used in context AND returned by User mock
        const loginData = {
            username: "test",
            password: "password"
        };
        mocked(User).findOne.mockReturnValueOnce(new Promise((res) => {
            res(undefined);
        }));
        const ctx: Context = {
            request: {
                body: {
                    ...loginData
                }
            },
            body: {}
        } as Context;
        await expect(async () => {
            await controllerInstance.loginHandler(ctx);
        })
            .rejects
            .toThrow(new RequestError(
                404,
                "User with this username not exist.",
                {errors: {notExist: "username"}}
                )
            );
    });

    test("Test login -> invalid password", async () => {
        // login data used in context AND returned by User mock
        const loginData = {
            username: "test",
            password: "password"
        };
        const hashedPassword = await argon2.hash("anotherpassword");
        mocked(User).findOne.mockReturnValueOnce(new Promise((res) => {
            res({
                username: loginData.username,
                privateData: {
                    password: hashedPassword
                }
            } as unknown as User);
        }));
        const ctx: Context = {
            request: {
                body: {
                    ...loginData
                }
            },
            body: {}
        } as Context;
        await expect(async () => {
            await controllerInstance.loginHandler(ctx);
        }).rejects.toThrow(new RequestError(401, "Password incorrect."));
    });

});
