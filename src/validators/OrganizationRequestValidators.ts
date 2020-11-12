/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */


import {bodyValidator, queryValidator} from "../utils/ajv-middleware/ajv-validation-middleware";
import {ajvInstance} from "../globals";


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
            }
        }
    },
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
    },
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
    },
    ajvInstance);

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
    },
    ajvInstance);

/**
 * RoleAddValidator - validator for role creating request.
 * @author Denis Afendikov
 */
export const RoleAddValidator = bodyValidator({
    $id: "RoleAddValidator",
    type: "object",
    required: ["name", "canManageUsers", "canCreateJobs", "canEditJobs",
        "canDeleteJobs", "canManageRoles", "canManagePlugins", "canManageTeams"],
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
            type: "number",
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
        }
    }
}, ajvInstance);

/**
 * RoleEditValidator - validator for role editing request.
 * @author Denis Afendikov
 */
export const RoleEditValidator = bodyValidator({
    $id: "RoleEditValidator",
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
        },
        permissionLevel: {
            type: "number",
            minimum: 0,
            maximum: 1000
        },
        color: {
            type: "string",
            maxLength: 255
        }
    }
}, ajvInstance);