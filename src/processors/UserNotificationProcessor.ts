/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/27/20, 6:07 PM
 * All rights reserved.
 */

import {Channel, Message} from "amqplib";
import Server from "../core/Server";
import {AMQP_USER_NOTIFICATION_QUEUE} from "../globals";
import Logger from "../core/Logger";
import UserNotificationMessage from "../interfaces/UserNotificationMessage";
import ClientWS from "../core/ClientWS";


/**
 * UserNotificationProcessor - function for processing user notifications queue.
 * @function
 * @async
 * @author Danil Andreev
 */
export default async function UserNotificationProcessor(): Promise<void> {
    /**
     * handler - AMQP messages handler.
     * @param message - AMQP message.
     * @param channel
     * @author Danil Andreev
     */
    async function handler(message: Message, channel: Channel): Promise<void> {
        try {
            let payload: UserNotificationMessage = null;
            try {
                payload = JSON.parse(message.content.toString());
                if (typeof payload.message !== "string")
                    throw new TypeError(`Incorrect type of message field 'message', expected "string", got "${typeof payload.message}"`);
                if (typeof payload.userId !== "number")
                    throw new TypeError(`Incorrect type of message field 'userId', expected "number", got "${typeof payload.userId}"`);
            } catch (error) {
                channel.ack(message);
                Logger.error({verbosity: 3})(error.message, error.stack).then();
                return;
            }
            ClientWS.sendToUser(payload.userId, payload.message);
            channel.ack(message);
        } catch (error) {
            channel.nack(message);
        }
    }

    const channel: Channel = await Server.getCurrent().getRabbit().createChannel();
    await channel.assertQueue(AMQP_USER_NOTIFICATION_QUEUE);
    await channel.prefetch(10);
    await channel.consume(AMQP_USER_NOTIFICATION_QUEUE, async (message: Message) => {
        await handler(message, channel);
    });
}
