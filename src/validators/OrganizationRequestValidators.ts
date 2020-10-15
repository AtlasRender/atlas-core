/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 07.10.2020, 17:50
 * All rights reserved.
 */


import {bodyValidator} from "../utils/ajv-middleware/ajv-validation-middleware";
import {ajvInstance} from "../globals";


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

export const OrganizationUserAddDeleteValidator = bodyValidator({
        $id: "OrganizationUserAddDeleteValidator",
        type: "object",
        required: ["userId"],
        properties: {
            userId: {
                type: "integer"
            }
        }
    },
    ajvInstance);

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
    }
}, ajvInstance);