/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */


import {bodyValidator, queryValidator} from "../utils/ajv-middleware/ajv-validation-middleware";
import {ajvInstance} from "../globals";
import {JSONSchemaType} from "ajv";


namespace OrganizationRequestValidators {
    export type IncludeUserIdsInBodyData = {
        userIds: number[]
    }
    export type IncludeUserIdInBodyData = {
        userId: number
    }
    export type RoleAddData = {
        name: string,
        description?: string,
        permissionLevel?: number,
        color?: string,
        canManageUsers?: boolean,
        canCreateJobs?: boolean,
        canEditJobs?: boolean,
        canDeleteJobs?: boolean,
        canManageRoles?: boolean,
        canManagePlugins?: boolean,
        canManageTeams?: boolean,
        canEditAudit?: boolean
    }
    export type RoleEditData = {
        name?: string,
        description?: string,
        permissionLevel?: number,
        color?: string,
        canManageUsers?: boolean,
        canCreateJobs?: boolean,
        canEditJobs?: boolean,
        canDeleteJobs?: boolean,
        canManageRoles?: boolean,
        canManagePlugins?: boolean,
        canManageTeams?: boolean,
        canEditAudit?: boolean
    }
    export type OrganizationRegisterData = {
        name: string,
        description?: string,
        _: IncludeUserIdsInBodyData,
        roles?: RoleAddData[],
        defaultRole?: RoleAddData
    }
    export type OrganizationEditData = {
        name: string,
        description?: string,
    }
}

/**
 * IncludeUserIdInBodyValidator - validator for body userIds field in request.
 * @author Denis Afendikov
 */
export const IncludeUserIdInBodyValidator = bodyValidator({
        $id: "IncludeUserIdInBodyValidator",
        type: "object",
        required: ["userId"],
        properties: {
            userId: {
                type: "integer"
            }
        }
    } as JSONSchemaType<OrganizationRequestValidators.IncludeUserIdInBodyData>,
    ajvInstance);

/**
 * IncludeUserIdsInBodyValidator - validator for body userIds field in request.
 * @author Denis Afendikov
 */
export const IncludeUserIdsInBodyValidator = bodyValidator({
        $id: "IncludeUserIdsInBodyValidator",
        type: "object",
        required: ["userIds"],
        properties: {
            userIds: {
                type: "array",
                items: {type: "integer"},
                minItems: 1
            }
        }
    } as JSONSchemaType<OrganizationRequestValidators.IncludeUserIdsInBodyData>,
    ajvInstance);

/**
 * OrganizationRegisterValidator - validator for organization creating request.
 * @author Denis Afendikov
 */
export const OrganizationRegisterValidator = bodyValidator({
        $id: "OrganizationRegisterValidator",
        type: "object",
        required: ["name"],
        properties: {
            name: {
                // TODO: alphanumeric only
                type: "string",
                minLength: 3,
                maxLength: 50
            },
            description: {
                type: "string",
                maxLength: 255
            },
            _: {
                $ref: "IncludeUserIdsInBodyValidator"
            },
            roles: {
                type: "array",
                items: {$ref: "RoleAddValidator"},
            },
            defaultRole: {
                $ref: "RoleAddValidator"
            }
        }
    } as JSONSchemaType<OrganizationRequestValidators.OrganizationRegisterData>,
    ajvInstance);

/**
 * OrganizationEditValidator - validator for organization edit request.
 * @author Denis Afendikov
 */
export const OrganizationEditValidator = bodyValidator({
        $id: "OrganizationEditValidator",
        type: "object",
        properties: {
            name: {
                // TODO: alphanumeric only
                type: "string",
                minLength: 3,
                maxLength: 50
            },
            description: {
                type: "string",
                maxLength: 255
            }
        }
    } as JSONSchemaType<OrganizationRequestValidators.OrganizationEditData>,
    ajvInstance);


/**
 * RoleAddValidator - validator for role creating request.
 * @author Denis Afendikov
 */
export const RoleAddValidator = bodyValidator({
        $id: "RoleAddValidator",
        type: "object",
        required: ["name"],
        properties: {
            name: {
                // TODO: alphanumeric only
                type: "string",
                minLength: 3,
                maxLength: 50
            },
            description: {
                type: "string",
                maxLength: 255
            },
            permissionLevel: {
                type: "integer",
                minimum: 0,
                maximum: 1000
            },
            color: {
                type: "string",
                maxLength: 255
            },
            canManageUsers: {
                type: "boolean",
                default: false
            },
            canCreateJobs: {
                type: "boolean",
                default: false
            },
            canEditJobs: {
                type: "boolean",
                default: false
            },
            canDeleteJobs: {
                type: "boolean",
                default: false
            },
            canManageRoles: {
                type: "boolean",
                default: false
            },
            canManagePlugins: {
                type: "boolean",
                default: false
            },
            canManageTeams: {
                type: "boolean",
                default: false
            },
            canEditAudit: {
                type: "boolean",
                default: false
            }
        }
    } as JSONSchemaType<OrganizationRequestValidators.RoleAddData>,
    ajvInstance);

/**
 * RoleEditValidator - validator for role editing request.
 * @author Denis Afendikov
 */
export const RoleEditValidator = bodyValidator({
        $id: "RoleEditValidator",
        type: "object",
        additionalProperties: false,
        properties: {
            name: {
                // TODO: alphanumeric only
                type: "string",
                minLength: 3,
                maxLength: 50
            },
            description: {
                type: "string",
                maxLength: 255
            },
            permissionLevel: {
                type: "integer",
                minimum: 0,
                maximum: 1000
            },
            color: {
                type: "string",
                maxLength: 255
            },
            canManageUsers: {
                type: "boolean"
            },
            canCreateJobs: {
                type: "boolean"
            },
            canEditJobs: {
                type: "boolean"
            },
            canDeleteJobs: {
                type: "boolean"
            },
            canManageRoles: {
                type: "boolean"
            },
            canManagePlugins: {
                type: "boolean"
            },
            canManageTeams: {
                type: "boolean"
            },
            canEditAudit: {
                type: "boolean"
            }
        }
    } as JSONSchemaType<OrganizationRequestValidators.RoleEditData>,
    ajvInstance);