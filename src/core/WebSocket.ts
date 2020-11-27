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


/**
 * WebSocketSessions - type for WebSocket sessions storage object.
 */
export type WebSocketSessions = {[key: string]: WebSocketSession};

/**
 * WebSocket - class, designed to handle web socket connections.
 * @class
 * @author Danil Andreev
 */
export default class WebSocket extends WS.Server {
    /**
     * KEY_GENERATING_ATTEMPTS - tries count before closing connection
     * with error when can not generate unique id for session.
     */
    public static KEY_GENERATING_ATTEMPTS: number = 10;
    //TODO: add normal type/interface
    public static sessions: WebSocketSessions = {};

    /**
     * Creates an instance of WebSocket.
     * @constructor
     * @author Danil Andreev
     */
    constructor() {
        //TODO: get port from config.
        super({
            port: 3003
        });

        this.on("connection", (ws: WS, greeting: IncomingMessage) => {
            try {
                const uid = WebSocket.generateUID();
                const authorizationHeader = greeting.headers.authorization;
                WebSocket.sessions[uid] = {
                    ws,
                    uid,
                    userId: 1,
                };
                

                this.on("close", () => {
                    delete WebSocket.sessions[uid];
                });
            } catch (error) {
                ws.close(423, "Server has too many connections.")
            }
        });
    }

    /**
     * sendToUser - method, designed to send messages to all of user sessions by user id in database.
     * @method
     * @param userId - Target user id.
     * @param message - Message payload.
     * @throws ReferenceError
     * @author Danil Andreev
     */
    public static sendToUser(userId, message): void {
        const targets = WebSocket.sessions;
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
