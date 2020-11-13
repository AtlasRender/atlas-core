/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
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