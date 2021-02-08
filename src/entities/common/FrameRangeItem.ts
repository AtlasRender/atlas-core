/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/1/20, 5:16 PM
 * All rights reserved.
 */

import * as _ from "lodash";
import FrameRangePair from "./FrameRangePair";


export interface FrameRangeItemOptions {
    start: number;
    end: number;
    step?: number;
    renumberStart?: number;
    renumberStep?: number;
}

export default class FrameRangeItem implements FrameRangeItemOptions {
    public readonly start: number;
    public readonly end: number;
    public readonly step: number;
    public readonly renumberStart?: number;
    public readonly renumberStep: number;

    /**
     * Creates an instance of FrameRangeItem.
     * @constructor
     * @param token - Input object for constructing.
     * @throws TypeError
     * @author Danil Andreev
     */
    public constructor(token: FrameRangeItemOptions | any) {
        if (typeof token !== "object")
            throw new TypeError(`Incorrect type of token, expected "object", got "${typeof token}"`);

        if (typeof token.start !== "number")
            throw new TypeError(`Incorrect type of field 'start', expected "number", got "${typeof token.start}"`);
        if (!_.isInteger(token.start))
            throw new TypeError(`Field 'start', must be an integer! Got: (${token.start})`);

        if (typeof token.end !== "number")
            throw new TypeError(`Incorrect type of field 'end', expected "number", got "${typeof token.end}"`);
        if (!_.isInteger(token.end))
            throw new TypeError(`Field 'end', must be an integer! Got: (${token.end})`);

        if (token.start > token.end)
            throw new RangeError(`Field 'start' can not be higher than 'end'.`);

        if (token.step !== undefined) {
            if (typeof token.step !== "number")
                throw new TypeError(`Incorrect type of field 'step', expected "number", got "${typeof token.step}"`);
            if (!_.isInteger(token.step))
                throw new TypeError(`Field 'step', must be an integer! Got: (${token.step})`);
            if (token.step === 0)
                throw new RangeError(`Field 'step' can not be equal 0`);
        }

        if (token.renumberStart !== undefined) {
            if (typeof token.renumberStart !== "number")
                throw new TypeError(`Incorrect type of field 'renumberStart', expected "number", got "${typeof token.renumberStart}"`);
            if (!_.isInteger(token.renumberStart))
                throw new TypeError(`Field 'renumberStart', must be an integer! Got: (${token.renumberStart})`);
        }

        if (token.renumberStep !== undefined) {
            if (typeof token.renumberStep !== "number")
                throw new TypeError(`Incorrect type of field 'renumberStep', expected "number", got "${typeof token.renumberStep}"`);
            if (!_.isInteger(token.renumberStep))
                throw new TypeError(`Field 'renumberStep', must be an integer! Got: (${token.renumberStep})`);
            if (token.renumberStep === 0)
                throw new RangeError(`Field 'renumberStep' can not be equal 0`);
        }

        this.start = token.start;
        this.end = token.end;
        this.step = token.step || 1;
        this.renumberStart = token.renumberStart;
        this.renumberStep = token.renumberStep || 1;
    }

    /**
     * getRange - returns array of frames with information about frame number and renumbered position.
     * @method
     * @author Danil Andreev
     */
    public getRange(): FrameRangePair[] {
        const result: FrameRangePair[] = [];
        let renumbered = this.renumberStart;
        for (let frame = this.start; frame <= this.end; frame += this.step) {
            result.push(new FrameRangePair(frame, renumbered || frame));
            if (renumbered)
                renumbered += this.renumberStep;
        }
        return result;
    }
}