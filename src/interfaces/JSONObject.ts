/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/28/20, 4:26 PM
 * All rights reserved.
 */

/**
 * JSONObject - interface for kay pair array structure.
 * @interface
 * @author Danil Andreev
 */
export default interface JSONObject<E = any> {
    [key: string]: E;
}
