/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/27/20, 2:11 PM
 * All rights reserved.
 */

import WebSocketSession from "../interfaces/WebSocketSession";
import Authenticator from "./Authenticator";
import UserJwt from "../interfaces/UserJwt";
import WebSocket from "./WebSocket";
import JSONObject from "../interfaces/JSONObject";


/**
 * ClientWS - class, designed to handle web socket connections.
 * @class
 * @author Danil Andreev
 */
export default class ClientWS extends WebSocket {
    /**
     * instance - current instance of the class.
     */
    protected static instance: ClientWS = null;

    /**
     * Creates an instance of ClientWS class.
     * __WARNING__
     * _This class uses a **singleton paradigm**_
     * @constructor
     */
    constructor() {
        super();
        if (ClientWS.instance)
            throw new ReferenceError("Instance of the server has been already created.");
    }

    /**
     * getCurrent - returns current instance of the server.
     * @method
     * @throws ReferenceError
     * @author Danil Andreev
     */
    public static getCurrent(): ClientWS {
        if (!ClientWS.instance)
            throw new ReferenceError("There is no instance of the ClientWS created.");
        return ClientWS.instance;
    }

    /**
     * sendToUser - method, designed to send messages to all of user sessions by user id in database.
     * @method
     * @param userId - Target user id.
     * @param message - Message payload.
     * @throws ReferenceError
     * @author Danil Andreev
     */
    public static sendToUser(userId: number, message: string | object): number {
        let payload: string = "";
        switch (typeof message) {
            case "object":
                payload = JSON.stringify(message);
                break;
            default:
                payload = String(message);
        }

        let affected = 0;
        for (const key in ClientWS.sessions) {
            const candidate: WebSocketSession = ClientWS.sessions[key];
            if (candidate.userId === userId) {
                try {
                    candidate.ws.send(payload);
                    affected++;
                } catch (error) {
                    //TODO: add error handling;
                    console.log(error);
                }
            }
        }
        return affected;
    }

    /**
     * terminateUserSession - method, designed to force terminate web socket session by user id.
     * @method
     * @param userId - Target user id.
     * @param code - Status code. Default - 499 | Client Closed Request
     * @param message - Close message.
     * @author Danil Andreev
     */
    public static terminateUserSession(userId: number, code: number = 499, message?: string): number {
        let payload: string = "";
        switch (typeof message) {
            case "object":
                payload = JSON.stringify(message);
                break;
            default:
                payload = String(message);
        }

        let affected = 0;
        for (const key in ClientWS.sessions) {
            const candidate: WebSocketSession = ClientWS.sessions[key];
            if (candidate.userId === userId) {
                try {
                    candidate.ws.send(payload);
                    candidate.ws.close(code, payload);
                } catch (error) {
                    //TODO: add error handling;
                    console.log(error);
                } finally {
                    affected++;
                    delete ClientWS.sessions[key];
                }
            }
        }
        return affected;
    }

    protected async validateAuthorization(authorization: string): Promise<JSONObject> {
        const userJwt: UserJwt = await Authenticator.validateToken(authorization)
        return {userId: userJwt.id};
    }
}
