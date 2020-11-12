/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

/**
 * UserJwt - interface for information, contained in user JWT.
 * @interface
 * @author Danil Andreev
 */
export default interface UserJwt {
    /**
     * username - user username.
     */
    username: string;
    /**
     * id - user id.
     */
    id: number;
    /**
     * expires - expiration timestamp of the token.
     */
    expires: string;
    /**
     * createdAt - timestamp when token was created.
     */
    createdAt: string;
}
