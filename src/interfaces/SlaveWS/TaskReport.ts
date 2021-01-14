/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/6/21, 1:57 PM
 * All rights reserved.
 */

/**
 * TaskReport - interface for task report payload.
 * @interface
 * @author Danil Andreev
 */
export default interface TaskReport {
    /**
     * taskId - processing task id.
     */
    taskId: number;
    /**
     * message - report message. Will be placed to database and will appear in task log.
     */
    message?: string;
    /**
     * progress - current progress of the task.
     */
    progress?: number;
}
