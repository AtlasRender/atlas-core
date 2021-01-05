/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/2/20, 3:44 PM
 * All rights reserved.
 */

import FrameRangeItem from "./FrameRangeItem";
import FrameRangePair from "./FrameRangePair";
import * as _ from "lodash";


/**
 * FrameRange - class, designed to create frame range.
 * @class
 * @author Danil Andreev
 */
export default class FrameRange extends Array<FrameRangePair>{
    /**
     * Creates an instance of FrameRange.
     * @constructor
     * @param items - Input frame range items.
     * @author Danil Andreev
     */
    public constructor(items?: FrameRangeItem[]) {
        super();
        if (items) {
            if (!Array.isArray(items))
                throw new TypeError(`Incorrect type of 'items', expected "FrameRangeItem[]", got "${typeof items}"`);

            if (!items.every((item: any) => item instanceof FrameRangeItem))
                throw new TypeError(`Incorrect type of 'items' elements, expected "FrameRangeItem".`);

            items.forEach((item: FrameRangeItem) => this.addRange(item));
        }
    }

    /**
     * addRange - adds new frame range item to frame range.
     * @method
     * @param input - Input frame range item
     * @author Danil Andreev
     */
    public addRange(input: FrameRangeItem | string): FrameRange {
        let range: FrameRangePair[] = [];

        if (input instanceof FrameRangeItem) {
            range = input.getRange();
        } else if (typeof input === "string") {
            range = FrameRange.getFramesFromRange(input);
        } else {
            throw new TypeError(`Incorrect type of 'input', expected "FrameRangeItem | string", got "${typeof FrameRangeItem}"`);
        }

        for (let i = 0; i < range.length; i++) {
            const selfIndex = this.findIndex((candidate: FrameRangePair) => candidate.renumbered === range[i].renumbered);
            if (selfIndex >= 0) {
                this[selfIndex] = range[i];
            } else {
                this.push(range[i]);
            }
        }
        return this;
    }

    public push(...items: FrameRangePair[]): number {
        for (const item of items) {
            if (!(item instanceof FrameRangePair))
                throw new TypeError(`Incorrect input tpe, expected "RangeFramePair", got "${item}`);

            const index: number = this.searchIndexToInsert(item);
            if (this.length < index) {
                if (this[index].renumbered === item.renumbered)
                    this.splice(index, 1, item);
                else
                    this.splice(index, 0, item);
            } else {
                super.push(item);
            }
        }
        return this.length;
    }

    /**
     * searchIndexToInsert - binary search algorithm to determine target place in array for input object.
     * @method
     * @param target - Target object ot place into array.
     * @author Danil Andreev
     */
    protected searchIndexToInsert(target: FrameRangePair): number {
        let start = 0;
        let end = this.length;
        if (!this.length) return 0;

        while (end - start > 0) {
            const middle = Math.floor((end - start) / 2 + start);
            if (end - start === 1) {
                if (target.renumbered > this[start].renumbered)
                    return end;
                else
                    return start;
            }

            if (target.renumbered > this[middle].renumbered) {
                start = middle;
            } else if (target.renumbered < this[middle].renumbered){
                end = middle;
            } else {
                return middle;
            }
        }
        return start;
    }

    /**
     * getFramesFromRange - returns array of FrameRangePair from frame range notation.
     * @method
     * @param range - Input information in range notation.
     * @throws SyntaxError
     * @author Danil Andreev
     */
    static getFramesFromRange(range: string): FrameRangePair[] {
        const tokens: string[] = range.split(" ");
        const frames = new Set<FrameRangePair>();
        const rangeRe = /([0-9]+)-([0-9]+)/;
        const singleRe = /([0-9]+)/;
        for (const token of tokens) {
            if (rangeRe.test(token)) {
                const [, start, end] = rangeRe.exec(token);
                if (+end < +start) continue;
                const localFrames = _.range(+start, +end + 1);
                for (const frame of localFrames) {
                    frames.add(new FrameRangePair(frame, frame));
                }
            } else if (singleRe.test(token)) {
                frames.add(new FrameRangePair(+token, +token));
            } else {
                throw new SyntaxError(`Incorrect syntax at or near "${token}".`);
            }
        }

        return [...frames];
    }
}
