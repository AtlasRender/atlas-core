/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 08.10.2020, 21:57
 * All rights reserved.
 */

/**
 * Class returning errors as JSON response.
 * @class
 * @author Denis Afendikov
 */
export default class RequestError extends Error {
    public readonly name = "RequestError";

    public readonly status: number;

    public readonly message: string;

    public readonly response: any;


    constructor(status: number, message: string, response: any = undefined) {
        super();
        this.status = status;
        this.message = message;
        this.response = response;
    }
}