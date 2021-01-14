/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/14/21, 2:56 PM
 * All rights reserved.
 */

import * as dotenv from "dotenv";
import JSONObject from "../interfaces/JSONObject";
import * as fs from "fs";

export default class SystemOptions {
    public static config: JSONObject<any> = {};

    constructor() {
        // dotenv.config();

        try {
            const configJson: JSONObject<any> = JSON.parse(fs.readFileSync("./src/config.json").toString());
            console.log(configJson);
        } catch (error) {
            if (error.code !== "ENOENT")
                console.error(`Unable to read configuration from "config.json" file.`, error);
        }
    }
}