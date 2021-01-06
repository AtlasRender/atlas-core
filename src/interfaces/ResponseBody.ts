/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 06.01.2021, 19:14
 * All rights reserved.
 */

export default interface ResponseBody {
    success: boolean,
    message: string,
    response: object,
    stack?: any,
}