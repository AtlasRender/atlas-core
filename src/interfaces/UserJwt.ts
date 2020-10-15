/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 15.10.2020, 20:53
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
