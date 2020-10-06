/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/6/20, 5:13 PM
 * All rights reserved.
 */

import * as cryptoRandomString from "crypto-random-string";
import * as Jwt from "koa-jwt";
import {Context} from "koa";

export interface UserJwt {
    username: string;
    userId: number;
    expires: Date;
}

export default class Authenticator {
    public static readonly key = cryptoRandomString({length: 30, type: "base64"});

    protected static jwtMiddleware;

    init() {
        Authenticator.jwtMiddleware = Jwt({
            secret: "adsf",
            key: Authenticator.key,
            isRevoked: Authenticator.checkTokenRevoked,
        }).unless({path: [/^\/auth/]});
    }

    protected static async checkTokenRevoked(ctx: Context, decodedToken: UserJwt, token: string): Promise<boolean> {

        return false;
    }

    public static getJwtMiddleware() {
        return this.jwtMiddleware.clone();
    }


}