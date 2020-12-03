/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/2/20, 5:02 PM
 * All rights reserved.
 */

import FrameRangeItem from "../../../src/core/FrameRange/FrameRangeItem";
import FrameRangePair from "../../../src/core/FrameRange/FrameRangePair";


describe("core->FrameRange->FrameRangeItem", () => {
    let token: any = null;

    beforeEach(() => {
        token = {
            start: 1,
            end: 100,
            step: 1,
            renumberStart: 20,
            renumberStep: 1,
        };
    })

    test("Test creation", () => {
        let result: FrameRangeItem = null;
        expect(() => result = new FrameRangeItem(token)).not.toThrowError();
        expect(result.start).toBe(token.start);
        expect(result.end).toBe(token.end);
        expect(result.step).toBe(token.step);
        expect(result.renumberStart).toBe(token.renumberStart);
        expect(result.renumberStep).toBe(token.renumberStep);
    });

    test("Test frame range generating.", () => {
        const token = {
            start: 1,
            end: 5,
            step: 2,
            renumberStart: 20,
            renumberStep: 3,
        }
        const expected = [
            new FrameRangePair(1,20),
            new FrameRangePair(3,23),
            new FrameRangePair(5,26),
        ];

        let result: FrameRangeItem = null;
        expect(() => result = new FrameRangeItem(token)).not.toThrowError();
        let range: FrameRangePair[] = [];
        expect(() => range = result.getRange()).not.toThrowError();
        expect(range.length).toBe(expected.length);
        expect(range).toEqual(expected);
    });

    test("Test with incorrect data. token.start not integer", () => {
        token.start = 0.1;
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.end not integer", () => {
        token.end = 0.1;
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.step not integer", () => {
        token.step = 0.1;
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.renumberStart not integer", () => {
        token.renumberStart = 0.1;
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.renumberStep not integer.", () => {
        token.renumberStep = 0.1;
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.start not a number.", () => {
        token.start = "1";
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.end not a number.", () => {
        token.end = "1";
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.step not a number.", () => {
        token.step = "1";
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.renumberStart not a number.", () => {
        token.renumberStart = "1";
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.renumberStep not a number.", () => {
        token.renumberStep = "1";
        expect(() => new FrameRangeItem(token)).toThrowError(TypeError);
    });

    test("Test with incorrect data. token.step = 0.", () => {
        token.step = 0;
        expect(() => new FrameRangeItem(token)).toThrowError(RangeError);
    });

    test("Test with incorrect data. token.renumberStep = 0.", () => {
        token.renumberStep = 0;
        expect(() => new FrameRangeItem(token)).toThrowError(RangeError);
    });

    test("Test with incorrect data. Start is higher than end..", () => {
        token.start = 100;
        token.end = 0;
        expect(() => new FrameRangeItem(token)).toThrowError(RangeError);
    });
});