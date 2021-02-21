/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 21.02.2021, 16:48
 * All rights reserved.
 */

import {mocked} from "ts-jest/utils";
import RenderJob from "../../src/entities/typeorm/RenderJob";
import RenderTask from "../../src/entities/typeorm/RenderTask";
import JobsProcessor from "../../src/processors/JobsProcessor";
import Server from "../../src/core/Server";
import * as Amqp from "amqplib";
import {AMQP_JOBS_QUEUE} from "../../src/globals";
import {BaseEntity, InsertQueryBuilder, InsertResult} from "typeorm";
import JobEvent, {JobEventType} from "../../src/core/JobEvent";
import RequestError from "../../src/errors/RequestError";
import Logger from "../../src/core/Logger";


jest.mock("../../src/core/Logger");
jest.mock("../../src/entities/typeorm/RenderJob");
jest.mock("../../src/entities/typeorm/RenderTask");
jest.mock("amqplib");


/* eslint @typescript-eslint/ban-ts-comment: 0 */

describe("processors -> JobsProcessor", () => {
    beforeEach(() => {
        mocked(RenderJob).mockClear();
        mocked(RenderTask).mockClear();
    });

    test("JobsProcessor() -> simple test", async () => {
        // mocking Server's RabbitMQ
        const amqpConnection = await Amqp.connect("");
        Server.getCurrent = jest.fn(() => ({
            getRabbit(): Amqp.Connection {
                return amqpConnection;
            }
        } as Server));

        // mocking RenderTasks
        const renderTasks = [];
        const createQueryBuilder: any = {
            select: () => createQueryBuilder,
            insert: () => createQueryBuilder,
            values: (vals) => ({
                execute: async () => {
                    console.log("Inserting values in RenderTask");
                    renderTasks.push(vals);
                    return {} as InsertResult;
                }
            })
        };
        jest.spyOn(RenderTask, "createQueryBuilder")
            .mockImplementation(() => createQueryBuilder);
        mocked(RenderTask).mockReturnValue({

        } as unknown as RenderTask);

        const renderJob = {
            id: 0,
            frameRange: [{
                start: 10,
                end: 12,
                step: 1
            }]
        } as unknown as RenderJob;
        // mocking RenderJob
        mocked(RenderJob).findOne.mockReturnValueOnce(new Promise((res, rej) => res(renderJob)));

        const doneRenderTasks = [
            {
                frame: 10,
                renumbered: 10,
                status: "pending",
                job: renderJob
            },
            {
                frame: 11,
                renumbered: 11,
                status: "pending",
                job: renderJob
            },
            {
                frame: 12,
                renumbered: 12,
                status: "pending",
                job: renderJob
            }
        ];
        await JobsProcessor();

        const channel = await amqpConnection.createChannel();
        const jobEvent: JobEvent = new JobEvent({
            type: JobEventType.CREATE_JOB,
            data: renderJob,
        });
        /** no need for `assertQueue` this because it's mocked
         @see "tests/__mocks__/amqplib.ts:20"
         **/
        channel.sendToQueue(AMQP_JOBS_QUEUE, Buffer.from(JSON.stringify(jobEvent)));

        await new Promise<void>((res, rej) => {
            setTimeout(() => {
                expect(renderTasks).toEqual(doneRenderTasks);
                res();
            }, 100);
        });
    });
});