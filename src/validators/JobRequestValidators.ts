/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 07.10.2020, 17:50
 * All rights reserved.
 */


import {bodyValidator, queryValidator} from "../utils/ajv-middleware/ajv-validation-middleware";
import {ajvInstance} from "../globals";


/**
 * JobSubmitValidator - validator for render job creating request.
 * @author Danil Andreev
 */
export const JobSubmitValidator = bodyValidator({
        $id: "JobSubmitValidator",
        type: "object",
        required: ["organization", "name", "attempts_per_task_limit", "frameRange"],
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
                type: "integer"
            },
            frameRange: {
                type: "string",
            }
        }
    },
    ajvInstance
);