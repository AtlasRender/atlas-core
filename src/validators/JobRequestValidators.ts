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


namespace JobRequestValidators {
    export type JobSubmitData = {
        name: string,
        description?: string,
        organization: number,
        attempts_per_task_limit: number,
        frameRange: any[],
        plugin: number,
        pluginSettings: object
    }
}


/**
 * JobSubmitValidator - validator for render job creating request.
 * @author Danil Andreev
 */
export const JobSubmitValidator = bodyValidator({
        $id: "JobSubmitValidator",
        type: "object",
        required: ["organization", "name", "attempts_per_task_limit", "frameRange", "plugin", "pluginSettings"],
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
            organization: {
                type: "integer",
            },
            attempts_per_task_limit: {
                type: "integer",
            },
            frameRange: {
                type: "array",
            },
            plugin: {
                type: "integer",
            },
            pluginSettings: {
                type: "object",
            }
        }
    } as JSONSchemaType<JobRequestValidators.JobSubmitData>,
    ajvInstance
);