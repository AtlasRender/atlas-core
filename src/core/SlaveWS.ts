/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/28/20, 1:55 PM
 * All rights reserved.
 */

import * as WS from "ws";
import Ajv from "ajv";
import WebSocket from "./WebSocket";
import {IncomingMessage} from "http";
import JSONObject from "../interfaces/JSONObject";
import RequestError from "../errors/RequestError";
import SlaveResponseSchema from "../validators/SlaveWS/SlaveResponseSchema";
import SlaveResponsePayloadTaskReportSchema from "../validators/SlaveWS/SlaveResponsePayloadTaskReportSchema";
import Slave from "../entities/typeorm/Slave";
import Server from "./Server";
import {RedisClient} from "redis";
import {promisify} from "util";


namespace SlaveWS {
    /**
     * SlaveMessage - interface for slave income messages.
     * @interface
     * @author Danil Andreev
     */
    export interface SlaveMessage<T = JSONObject> extends JSONObject {
        /**
         * type - report type.
         */
        type: "report" | "taskStart" | "taskFinish";
        /**
         * payload - report payload. Can contain additional information.
         */
        payload?: T;
        /**
         * slaveId - slave identifier.
         */
        slaveId?: number;
    }

    /**
     * TaskReport - interface for task report payload.
     * @interface
     * @author Danil Andreev
     */
    export interface TaskReport {
        /**
         * taskId - processing task id.
         */
        taskId: number;
        /**
         * message - report message. Will be placed to database and will appear in task log.
         */
        message?: string;
        /**
         * progress - current progress of the task.
         */
        progress?: number;
    }
}

class SlaveWS extends WebSocket {
    /**
     * instance - current SlaveWS instance.
     */
    public static instance: SlaveWS;
    /**
     * ajv - ajv instance for validation.
     */
    protected readonly ajv;
    public static readonly responseSchema: object = SlaveResponseSchema;
    public static readonly responsePayloadTaskReportSchema = SlaveResponsePayloadTaskReportSchema;

    /**
     * Creates an instance of the SlaveWS.
     * @constructor
     * @param options - Options.
     * @author Danil Andreev
     */
    public constructor(options: WebSocket.Options) {
        super(options);
        this.ajv = new Ajv();
        if (SlaveWS.instance)
            throw new ReferenceError("Instance of the server has been already created.");
        SlaveWS.instance = this;

        this.addHandler(this.handleMessage);
    }

    /**
     * disconnectSlaveFromTask - sends message to slave to interrupt current task processing.
     * @method
     * @param slaveID - Target slave ID.
     * @param taskID - Target task ID.
     * @author Danil Andreev
     */
    public disconnectSlaveFromTask(slaveID, taskID): void {
        //TODO: slave can be connected just to one core node simultaneously.
        // Maybe it has sense to store connections in Redis.s
    }

    /**
     * handleMessage - method for handling income web socket messages.
     * @method
     * @param ws - Web socket connection.
     * @param message - Income message.
     * @author Danil Andreev
     */
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

    /**
     * validatePayload - validates income message payload.
     * @method
     * @param data - Input payload.
     * @throws RequestError
     * @author Danil Andreev
     */
    protected validatePayload(data): void {
        if (!this.ajv.validate(SlaveWS.responseSchema, data))
            throw new RequestError(400, "Incorrect payload", this.ajv.errorsText());

        switch (data.type) {
            case "report":
                if (!this.ajv.validate(SlaveWS.responsePayloadTaskReportSchema, data?.payload))
                    throw new RequestError(400, "Incorrect payload", this.ajv.errorsText());
                break;
        }
    }

    /**
     * validateAuthorization - method, designed to validate authorization data on client connection.
     * @method
     * @param authorization - Authorization data.
     * @param greeting - Greeting message from connection.
     * @author Danil Andreev
     */
    protected async validateAuthorization(authorization: string, greeting: IncomingMessage): Promise<JSONObject> {
        const slave: Slave = await Slave.findOne({where: {token: authorization}});

        if (!slave) throw new Error("Unauthorized");

        const redis: RedisClient = Server.getCurrent().getRedis();
        // TODO: check if this slave is already connected.

        //TODO: finish
        const session: string = await promisify(redis.get)(authorization);


        return {
            id: slave.id,
        };
    }
}

export default SlaveWS;