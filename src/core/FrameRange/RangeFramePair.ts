/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/2/20, 4:13 PM
 * All rights reserved.
 */

import * as _ from "lodash";


/**
 * RangeFramePair - class for frame range pair information.
 */
export default class RangeFramePair {
    /**
     * target - target frame from the scene.
     */
    public readonly target: number;
    /**
     * renumbered - frame number after renumbering.
     */
    public readonly renumbered: number;

    constructor(target: number, renumbered: number) {
        if (typeof target !== "number")
            throw new TypeError(`Incorrect type of 'target', expected "number", got "${typeof target}"`);
        if (_.isInteger(target))
            throw new TypeError(`Value 'target' must be integer!`);

        if (typeof renumbered !== "number")
            throw new TypeError(`Incorrect type of 'renumbered', expected "number", got "${typeof renumbered}"`);
        if (_.isInteger(renumbered))
            throw new TypeError(`Value 'renumbered' must be integer!`);

        this.target = target;
        this.renumbered = renumbered;
    }
}