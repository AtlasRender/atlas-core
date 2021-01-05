/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/28/20, 1:55 PM
 * All rights reserved.
 */

import * as WS from "ws";
import * as Ajv from "ajv";
import WebSocketOptions from "../interfaces/WebSocketOptions";
import WebSocket from "./WebSocket";
import {IncomingMessage} from "http";
import JSONObject from "../interfaces/JSONObject";


export default class SlaveWS extends WebSocket {
    public static instance: SlaveWS;
    protected static readonly ajv = new Ajv();
    public static readonly responseSchema: object = {
        $id: "SlaveWS_responseSchema",
        required: ["type"],
        properties: {
            type: {
                type: "string",
                enum: [
                    "report"
                ]
            }
        },
        type: "object",
    }

    public constructor(options: WebSocketOptions) {
        super(options);
        if (SlaveWS.instance)
            throw new ReferenceError("Instance of the server has been already created.");
        SlaveWS.instance = this;

        this.addHandler(this.handleMessage);
    }

    protected handleMessage(ws: WS, message: string): void {
        let payload = null;
        try {
            payload = JSON.parse(message);
            //TODO: add entity object for validating input payload.
        } catch (error) {
            if (error instanceof SyntaxError)
                ws.close(1007, "Invalid payload.");
        }



    }

    protected validateAuthorization(authorization: string, greeting: IncomingMessage): JSONObject | Promise<JSONObject> {
        return undefined;
    }
}
