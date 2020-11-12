/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import * as Ajv from "ajv";
import exp = require("constants");

/**
 * AMQP_CONNECTION_QUEUE - queue name for slaves connection reports.
 */
export const AMQP_CONNECTION_QUEUE = "slave_connection"
/**
 * AMQP_TASKS_QUEUE - queue name for render tasks.
 */
export const AMQP_TASKS_QUEUE = "render_tasks"
/**
 * AMQP_REPORTS_QUEUE - queue name for slaves runtime reports.
 */
export const AMQP_TASK_REPORTS_QUEUE = "slave_reports"
/**
 * AMQP_JOBS_QUEUE - queue name for hobs management.
 */
export const AMQP_JOBS_QUEUE = "jobs";

/**
 * REDIS_USER_JWT_PRIVATE_KEY - user JWT private key.
 */
export const REDIS_USER_JWT_PRIVATE_KEY = "USER_JWT_PRIVATE_KEY";

export const ajvInstance = new Ajv({
    allErrors: true,
    useDefaults: true,
    // jsonPointers: true,
    errorDataPath: "property", // deprecated
    schemaId: "auto",
    messages: false,
});

export const PLUGIN_SETTING_TYPES = [
    "number",
    "string",
    "integer",
    "date",
    "array"
];
