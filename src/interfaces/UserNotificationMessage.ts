/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/27/20, 6:20 PM
 * All rights reserved.
 */

/**
 * UserNotificationMessage - interface for notification message for user through web socket.
 * @interface
 * @author Danil Andreev
 */
export default interface UserNotificationMessage {
    /**
     * userId - target user id.
     */
    userId: number;
    /**
     * message - message payload to deliver via web socket.
     */
    message: string;
}
