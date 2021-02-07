/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/28/21, 5:30 PM
 * All rights reserved.
 */

import Controller from "../core/Controller";


/**
 * NestedController - decorator for adding nested controllers.
 * @param controller - Controller type.
 * @param baseRoute - Base route for nested controller. If declared - will replace native controller base route.
 * @author Danil Andreev
 */
function NestedController(controller: typeof Controller, baseRoute?: string) {
    return function HTTPControllerWrapper<T extends new(...args: any[]) => {}>(objectConstructor: T): T {
        return class WrappedController extends objectConstructor {
            constructor(...args: any[]) {
                super(args);
                if (this instanceof Controller) {
                    const instance = new controller();
                    this.use(baseRoute || instance.baseRoute, instance.routes(), instance.allowedMethods());
                } else {
                    throw new TypeError(`Invalid target class, expected Controller.`);
                }
            }
        };
    };
}

export default NestedController;
