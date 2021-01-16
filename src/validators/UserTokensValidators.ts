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


namespace UserTokensValidator {
    export type UserTokenCreateBodyData = {
        name: string,
        description: string | null
    }
}


/**
 * UserTokenCreateBodyValidator - validator for user token creating request.
 * @author Danil Andreev
 */
export const UserTokenCreateBodyValidator = bodyValidator<UserTokensValidator.UserTokenCreateBodyData>({
        $id: "UserTokenCreateBodyValidator",
        type: "object",
        required: ["name"],
        properties: {
            name: {
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
    ajvInstance
);
