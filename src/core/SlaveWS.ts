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
import RequestError from "../errors/RequestError";


export default class SlaveWS extends WebSocket {
    public static instance: SlaveWS;
    protected readonly ajv;
    public static readonly responseSchema: object = {
        $id: "SlaveWS_responseSchema",
        required: ["type"],
        properties: {
            type: {
                type: "string",
                enum: [
                    "report",
                    "taskStart",
                    "taskFinish"
                ]
            },
            payload: {
                type: "object"
            }
        },
        type: "object",
    }

    public static readonly responsePayloadTaskReportSchema = {
        $id: "SlaveWS_responsePayloadTaskReportSchema",
        required: ["taskId"],
        properties: {
            taskId: {
                type: "integer",
            },
            message: {
                type: "string",
            },
            progress: {
                type: "integer",
                min: 0,
                max: 100,
            }
        }
    }

    public constructor(options: WebSocketOptions) {
        super(options);
        this.ajv = new Ajv();
        if (SlaveWS.instance)
            throw new ReferenceError("Instance of the server has been already created.");
        SlaveWS.instance = this;

        this.addHandler(this.handleMessage);
    }

    public disconnectSlaveFromTask(slaveID, taskID) {
        //TODO: slave can be connected hist to one core node simultaneously.
        // Maybe it has sense to store connections in Redis.
    }

    protected handleMessage(ws: WS, message: string): void {
        let data = null;
        try {
            data = JSON.parse(message);
            //TODO: add entity object for validating input payload.
        } catch (error) {
            if (error instanceof SyntaxError)
                ws.close(1007, "Invalid payload.");
        }

        try {
            this.validatePayload(data);
        } catch (error) {
            //TODO: handle incorrect message error;
            return;
        }

        switch (data.type) {
            case "report":
                //TODO: add report handler.
        }

    }

    protected validatePayload(data) {
        if (!this.ajv.validate(SlaveWS.responseSchema, data))
            throw new RequestError(400, "Incorrect payload", this.ajv.errorsText());

        switch (data.type) {
            case "report":
                if (!this.ajv.validate(SlaveWS.responsePayloadTaskReportSchema, data?.payload))
                    throw new RequestError(400, "Incorrect payload", this.ajv.errorsText());
                break;
        }
    }

    protected validateAuthorization(authorization: string, greeting: IncomingMessage): JSONObject | Promise<JSONObject> {
        return undefined;
    }
}
