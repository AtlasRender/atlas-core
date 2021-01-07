/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 13.11.2020, 20:11
 * All rights reserved.
 */

import getFramesFromRange from "../../src/utils/getFramesFromRange";


describe("utils -> getFramesFromRange", () => {
    test("Test \"100 200\"", () => {
        const expected = [100, 200];
        const range = "100 200";
        expect(getFramesFromRange(range)).toEqual(expected);
    });

    test("Test \"100 20-25\"", () => {
        const expected = [20, 21, 22, 23, 24, 25, 100];
        const range = "100 20-25";
        expect(getFramesFromRange(range).sort()).toEqual(expected.sort());
    });

    test("Test \"20-30 22-24 100-0 29\"", () => {
        const expected = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        const range = "20-30 22-24 100-0 29";
        expect(getFramesFromRange(range).sort()).toEqual(expected.sort());
    });
});
