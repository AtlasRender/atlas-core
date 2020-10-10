/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10.10.2020, 23:17
 * All rights reserved.
 */

import Controller from "../core/Controller";
import LoginController from "./LoginController";

describe("controllers -> LoginController", () => {
    test("Test if controller is instance of Controller", () => {
        const controller: LoginController = new LoginController();
        expect(controller instanceof Controller).toBe(true);
    });
});
