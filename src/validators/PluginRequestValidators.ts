/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import {bodyValidator} from "../utils/ajv-middleware/ajv-validation-middleware";
import {ajvInstance} from "../globals";
import {JSONSchemaType} from "ajv";


namespace PluginRequestValidators {
    export type PluginCreateData = {
        name?: string,
        description?: string,
        file: number,
        note?: string,
        version?: string,
        readme?: string,
    }
}


/**
 * PluginCreateBodyValidator - validator for plugin create request.
 * @author Danil Andreev
 */
export const PluginCreateBodyValidator = bodyValidator({
        $id: "PluginCreateBodyValidator",
        type: "object",
        required: ["file"],
        properties: {
            name: {
                type: "string",
                minLength: 3,
                maxLength: 50
            },
            description: {
                type: "string",
                maxLength: 255
            },
            file: {
                type: "integer"
            },
            note: {
                type: "string",
                maxLength: 255,
            },
            version: {
                type: "string",
                maxLength: 30,
            },
            readme: {
                type: "string",
                maxLength: 10000,
            },
        }
    } as JSONSchemaType<PluginRequestValidators.PluginCreateData>,
    ajvInstance
);
