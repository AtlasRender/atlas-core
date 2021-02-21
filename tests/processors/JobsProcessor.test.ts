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


jest.mock("../../src/core/Logger");
jest.mock("../../src/entities/typeorm/RenderJob");
jest.mock("../../src/entities/typeorm/RenderTask");
jest.mock("amqplib");


describe("processors -> JobsProcessor", () => {
    beforeEach(() => {
        mocked(RenderJob).mockClear();
        mocked(RenderTask).mockClear();
    });

    test("JobsProcessor() -> simple test", async () => {
        const amqpConnection = await Amqp.connect("");
        console.log(amqpConnection);
        Server.getCurrent = jest.fn(() => ({
            getRabbit(): Amqp.Connection {
                return amqpConnection;
            }

        } as Server));

        await JobsProcessor();
        expect(true).toBeTruthy();
    });
});