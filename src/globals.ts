/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 09.10.2020, 18:43
 * All rights reserved.
 */

import * as Ajv from "ajv";
import exp = require("constants");

/**
 * AMQP_CONNECTION_QUEUE - queue name for slaves connection reports.
 */
export const AMQP_CONNECTION_QUEUE = "slave_connection1"
/**
 * AMQP_TASKS_QUEUE - queue name for render tasks.
 */
export const AMQP_TASKS_QUEUE = "render_tasks1"
/**
 * AMQP_REPORTS_QUEUE - queue name for slaves runtime reports.
 */
export const AMQP_TASK_REPORTS_QUEUE = "slave_reports1"
/**
 * AMQP_JOBS_QUEUE - queue name for hobs management.
 */
export const AMQP_JOBS_QUEUE = "jobs1";

export const ajvInstance = new Ajv({
    allErrors: true,
    useDefaults: true,
    // jsonPointers: true,
    errorDataPath: "property", // deprecated
    schemaId: "auto",
    messages: false,
});

