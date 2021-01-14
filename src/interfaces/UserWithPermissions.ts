/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 17.12.2020, 21:43
 * All rights reserved.
 */

import User from "../entities/typeorm/User";


export interface UserPermissions {
    canManageUsers: number,
    canManageRoles: number,
    canCreateJobs: number,
    canDeleteJobs: number,
    canEditJobs: number,
    canManagePlugins: number,
    canManageTeams: number,
    canEditAudit: number,
}

export interface UserWithPermissions extends User {
    permissions?: UserPermissions
}