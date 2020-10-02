/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/2/20, 4:54 PM
 * All rights reserved.
 */

import Test from "./Test";
import Controller from "../core/Controller";

describe("controllers -> Test", () => {
    test("Test is controller instance of Controller", () => {
        const controller: Test = new Test();
        expect(controller instanceof Controller).toBe(true);
    });
});
