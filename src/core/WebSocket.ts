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
import WebSocketOptions from "../interfaces/WebSocketOptions";
import RequestError from "../errors/RequestError";
import {URL} from "url";
import JSONObject from "../interfaces/JSONObject";


/**
 * WebSocketSessions - type for ClientWS sessions storage object.
 */
export type WebSocketSessions = { [key: string]: WebSocketSession };

/**
 * WebSocketHandler - type for ClientWS handler function.
 * If handler returns truthy value - chained call will be stopped.
 * If not - next handler in chain will be called.
 */
export type WebSocketHandler = (ws: WS, message: string) => Promise<boolean | void> | boolean | void;

/**
 * ClientWS - class, designed to handle web socket connections.
 * @class
 * @abstract
 * @author Danil Andreev
 */
export default abstract class WebSocket extends WS.Server {
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
     * @param options - Additional options for web socket.
     * @constructor
     * @throws ReferenceError
     * @author Danil Andreev
     */
    protected constructor(options?: WebSocketOptions) {
        super({
            port: options?.port || 3003,
        });
        this.on("connection", this.onConnection);
        console.log("WebSocket server is listening on port 3003");
    }

    /**
     * validateAuthorization - method, designed to validate authorization information.
     * Method must return a session information of throw error if authorization is not valid.
     * @method
     * @throws Error
     * @author Danil Andreev
     */
    protected abstract validateAuthorization(authorization: string, greeting: IncomingMessage): JSONObject | Promise<JSONObject>;

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
     * generateUID - method, designed to generate unique id for web socket client.
     * @method
     * @throws Error
     * @author Danil Andreev
     */
    protected static generateUID(): string {
        //TODO: change to generator to optimize speed.
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

    /**
     * onConnection - method, designed to handle web socket connection open.
     *
     * __WARNING__
     *
     * _If you want to extend this method - you must **override** it and **call super method**_
     * @param ws - Web socket connection session instance.
     * @param greeting - Incoming greeting message.
     * @protected
     * @author Danil Andreev
     */
    protected async onConnection(ws: WS, greeting: IncomingMessage): Promise<void> {
        try {
            const uid = WebSocket.generateUID();
            // let clearQuery = greeting.url;
            // if (clearQuery[0] === "/")
            //     clearQuery = clearQuery.slice(2);
            // else
            //     clearQuery = clearQuery.slice(1);

            const url = new URL(greeting.url);

            //TODO: remove qs! Use URL
            //const bearer: string = String(qs.parse(clearQuery).bearer);
            const bearer: string = url.searchParams.get("bearer");
            if (!bearer)
                throw new RequestError(4401, "You must send Bearer to access this resource.");

            try {
                const session: JSONObject = await this.validateAuthorization(bearer, greeting);
                WebSocket.sessions[uid] = {
                    ...session,
                    ws,
                    uid,
                };
                // const userJwt: UserJwt = await Authenticator.validateToken(bearer);
                // WebSocket.sessions[uid] = {
                //     ws,
                //     uid,
                //     userId: userJwt.id,
                // };
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

            this.on("close", async () => {
                await this.onClose(uid, ws);
            });
        } catch (error) {
            if (error instanceof RequestError)
                ws.close(error.status, error.message);
            else
                ws.close(1009, "Server has too many connections.");
        }
    }

    /**
     * onClose - method, designed to handle web socket connection close.
     *
     * __WARNING__
     *
     * _If you want to extend this method - you must **override** it and **call super method**_     * @param uid - Session unique id.
     * @param ws - Web socket connection session instance.
     * @protected
     * @author Danil Andreev
     */
    protected async onClose(uid: string, ws: WS) {
        delete WebSocket.sessions[uid];
    }
}

