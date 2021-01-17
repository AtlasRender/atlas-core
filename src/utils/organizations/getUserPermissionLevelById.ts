/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 17.01.2021, 13:37
 * All rights reserved.
 */

import {getRepository} from "typeorm";
import Role from "../../entities/typeorm/Role";


export default async function getUserPermissionLevelById(userId: number, organizationId: number): Promise<number | undefined> {
    const role = await getRepository(Role)
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.users", "user", "user.id = :userId",
            {userId: userId})
        .where({organization: organizationId})
        .andWhere("user.id = :userId", {userId})
        .orderBy({"role.permissionLevel": "DESC"})
        .getOne();
    return role?.permissionLevel;
}