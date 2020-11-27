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


export default class WebSocket extends WS.Server {
    public static clients = {};
    public static KEY_GENERATING_ATTEMPTS: number = 10;

    constructor() {
        //TODO: get port from config.
        super({
            port: 3003
        });

        this.on("connection", (ws: WS, greeting: IncomingMessage) => {
            try {
                const uid = WebSocket.generateUID();
                this.clients[uid] = ws;
                

                this.on("close", () => {
                    delete this.clients[uid];
                });
            } catch (error) {
                ws.close(423, "Server has too many connections.")
            }
        });
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
        } while (this.clients[uid]);
        return uid;
    }

}
