/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/2/20, 5:01 PM
 * All rights reserved.
 */

import FrameRange from "../../../src/core/FrameRange/FrameRange";
import FrameRangeItem from "../../../src/core/FrameRange/FrameRangeItem";
import FrameRangePair from "../../../src/core/FrameRange/FrameRangePair";


describe("core->FrameRange->FrameRange", () => {
    test("Test frame range creation.", () => {
        let result: FrameRange = null;
        expect(() => result = new FrameRange()).not.toThrowError();
        let item1: FrameRangeItem = null;
        expect(() => item1 = new FrameRangeItem({start: 0, end: 3})).not.toThrowError();
        let item2: FrameRangeItem = null;
        expect(() => item1 = new FrameRangeItem({start: 5, end: 7})).not.toThrowError();

        expect(() => result.addRange(item1)).not.toThrowError();
        // expect(result).toEqual([
        //     new FrameRangePair(0, 0),
        //     new FrameRangePair(1, 1),
        //     new FrameRangePair(2, 2),
        //     new FrameRangePair(3, 3),
        // ]);
        // expect(() => result.addRange(item2)).not.toThrowError();
        // expect(result).toEqual([
        //     new FrameRangePair(0, 0),
        //     new FrameRangePair(1, 1),
        //     new FrameRangePair(2, 2),
        //     new FrameRangePair(3, 3),
        //     new FrameRangePair(5, 5),
        //     new FrameRangePair(6, 6),
        //     new FrameRangePair(7, 7),
        // ]);
    });
});