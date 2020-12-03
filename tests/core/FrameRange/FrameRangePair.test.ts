/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/2/20, 5:04 PM
 * All rights reserved.
 */

import FrameRangePair from "../../../src/core/FrameRange/FrameRangePair";


describe("core->FrameRange->FrameRangePair", () => {
    test("Test creation", () => {
        let result: FrameRangePair = null;
        expect(() => result = new FrameRangePair(10, 20)).not.toThrowError();
        expect(result.target).toBe(10);
        expect(result.renumbered).toBe(20);
    });

    test("Test not integer input", () => {
        expect(() => new FrameRangePair(10.1, 20)).toThrowError(TypeError);
        expect(() => new FrameRangePair(10, 20.1)).toThrowError(TypeError);
        expect(() => new FrameRangePair(10.1, 20.1)).toThrowError(TypeError);
    });
});
