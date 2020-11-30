/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/27/20, 2:11 PM
 * All rights reserved.
 */

import * as WS from "ws";
import * as CryptoRandomString from "crypto-random-string";
import {IncomingMessage} from "http";
import WebSocketSession from "../interfaces/WebSocketSession";
import Authenticator from "./Authenticator";
import RequestError from "../errors/RequestError";
import UserJwt from "../interfaces/UserJwt";
import qs = require("qs");


/**
 * WebSocketSessions - type for WebSocket sessions storage object.
 */
export type WebSocketSessions = { [key: string]: WebSocketSession };

/**
 * WebSocketHandler - type for WebSocket handler function.
 * If handler returns truthy value - chained call will be stopped.
 * If not - next handler in chain will be called.
 */
export type WebSocketHandler = (ws: WS, message: string) => Promise<boolean | void> | boolean | void;

/**
 * WebSocket - class, designed to handle web socket connections.
 * @class
 * @author Danil Andreev
 */
export default class WebSocket extends WS.Server {
    /**
     * instance - current instance of the class.
     */
    protected static instance: WebSocket = null;

    /**
     * KEY_GENERATING_ATTEMPTS - tries count before closing connection
     * with error when can not generate unique id for session.
     */
    public static KEY_GENERATING_ATTEMPTS: number = 10;

    /**
     * sessions - key value pair structure of all web socket opened sessions.
     */
    public static sessions: WebSocketSessions = {};

    /**
     * handlers - an array of client message handlers.
     */
    protected handlers: WebSocketHandler[] = [];

    /**
     * Creates an instance of WebSocket.
     * @constructor
     * @throws ReferenceError
     * @author Danil Andreev
     */
    constructor(config?: any) {
        //TODO: get port from config.
        super({
            port: 3003
        });

        if (WebSocket.instance)
            throw new ReferenceError("Instance of the server has been already created.");

        this.on("connection", async (ws: WS, greeting: IncomingMessage) => {
            console.log("connection to web socket");
            try {
                const uid = WebSocket.generateUID();
                let clearQuery = greeting.url;
                if (clearQuery[0] === "/")
                    clearQuery = clearQuery.slice(2);
                else
                    clearQuery = clearQuery.slice(1);

                const bearer: string = String(qs.parse(clearQuery).bearer);
                if (!bearer)
                    throw new RequestError(4401, "You must send Bearer to access this resource.");

                try {
                    const userJwt: UserJwt = await Authenticator.validateToken(bearer);
                    WebSocket.sessions[uid] = {
                        ws,
                        uid,
                        userId: userJwt.id,
                    };
                } catch (error) {
                    throw new RequestError(4401, "Unauthorized");
                }

                this.on("message", async (message: string) => {
                    for (const handler of this.handlers) {
                        let result = handler(ws, message);
                        if (result instanceof Promise)
                            result = await result;
                        if (result)
                            break;
                    }
                });

                this.on("close", () => {
                    delete WebSocket.sessions[uid];
                });

                ws.send(JSON.stringify({type: "ping", payload: "hello"}));
            } catch (error) {
                if (error instanceof RequestError)
                    ws.close(error.status, error.message);
                else
                    ws.close(1009, "Server has too many connections.");
            }
        });
        console.log("WebSocket server is listening on port 3003");
    }

    /**
     * addHandler - method, designed to add client messages handlers.
     * @method
     * @param handler - Handler callback.
     * @author Danil Andreev
     */
    public addHandler(handler: WebSocketHandler) {
        this.handlers.push(handler);
    }

    /**
     * getCurrent - returns current instance of the server.
     * @method
     * @throws ReferenceError
     * @author Danil Andreev
     */
    public static getCurrent(): WebSocket {
        if (!WebSocket.instance)
            throw new ReferenceError("There is no instance of the WebSocket created.");
        return WebSocket.instance;
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
        for (const key in WebSocket.sessions) {
            const candidate: WebSocketSession = WebSocket.sessions[key];
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
        for (const key in WebSocket.sessions) {
            const candidate: WebSocketSession = WebSocket.sessions[key];
            if (candidate.userId === userId) {
                try {
                    candidate.ws.send(payload);
                    candidate.ws.close(code, payload);
                } catch (error) {
                    //TODO: add error handling;
                    console.log(error);
                } finally {
                    affected++;
                    delete WebSocket.sessions[key];
                }
            }
        }
        return affected;
    }

    /**
     * generateUID - method, designed to generate unique id for web socket client.
     * @method
     * @throws Error
     * @author Danil Andreev
     */
    protected static generateUID(): string {
        let uid: string = "";
        let attempts: number = 0;
        do {
            if (attempts > this.KEY_GENERATING_ATTEMPTS)
                throw new Error("Failed to generate unique id.");
            uid = CryptoRandomString({length: 10, type: "base64"});
            attempts++;
        } while (WebSocket.sessions[uid]);
        return uid;
    }
}
