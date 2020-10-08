/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 08.10.2020, 21:47
 * All rights reserved.
 */

import * as Ajv from "ajv";
import RequestError from "../../errors/RequestError";

const validatorFactory = (schema: object, ajvInst: Ajv.Ajv) => {
    if (!ajvInst) {
        console.error("No Ajv instance provided!");
        throw ReferenceError("No Ajv instance provided!");
    }

    ajvInst.addSchema(schema);

    return (body) => {
        const isValid = ajvInst.validate(schema, body);
        if (!isValid) {
            throw new RequestError(400, "AJV detect an invalid payload", {
                name: "AJV_INVALID_PAYLOAD",
                info: {errors: ajvInst.errors}
            });
        }
    };
};

const middlewareFactory = (schema: object, ajvInst: Ajv.Ajv, ) => {

}

export const bodyValidator = (schema: object) => {

};