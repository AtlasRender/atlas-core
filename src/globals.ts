/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import Ajv from "ajv";
import addFormats from "ajv-formats"

export const ajvInstance = new Ajv({
    allErrors: true,
    useDefaults: true,
    // jsonPointers: true,
    // errorDataPath: "property", // deprecated
    // schemaId: "auto",
    messages: false,
});
// @ts-ignore
addFormats(ajvInstance);

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
 * AMQP_JOBS_QUEUE - queue name for jobs management.
 */
export const AMQP_JOBS_QUEUE = "jobs";

/**
 * AMQP_USER_NOTIFICATION_QUEUE - queue name for user notifications.
 */
export const AMQP_USER_NOTIFICATION_QUEUE = "user_notifications";

/**
 * REDIS_USER_JWT_PRIVATE_KEY - user JWT private key.
 */
export const REDIS_USER_JWT_PRIVATE_KEY = "USER_JWT_PRIVATE_KEY";


// CLIENT_WEB_SOCKET_EVENT_TYPES
/**
 * CWS_RENDER_JOB_UPDATE - event type for render job update action.
 */
export const CWS_RENDER_JOB_UPDATE = "RENDER_JOB_UPDATE";

/**
 * CWS_RENDER_JOB_CREATE - event type for render job create action.
 */
export const CWS_RENDER_JOB_CREATE = "RENDER_JOB_CREATE";

/**
 * CWS_RENDER_JOB_DELETE - event type for render job delete action.
 */
export const CWS_RENDER_JOB_DELETE = "RENDER_JOB_DELETE";

/**
 * CWS_RENDER_JOB_ATTEMPT_LOG_CREATE - event type for render job attempt log create action.
 */
export const CWS_RENDER_JOB_ATTEMPT_LOG_CREATE = "RENDER_JOB_ATTEMPT_LOG_CREATE";

/**
 * CWS_RENDER_TASK_UPDATE - event type for render task update action.
 */
export const CWS_RENDER_TASK_UPDATE = "RENDER_TASK_UPDATE";
