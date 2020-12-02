/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 12/2/20, 3:44 PM
 * All rights reserved.
 */

import FrameRangeItem from "./FrameRangeItem";
import FrameRangePair from "./FrameRangePair";


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
    public addRange(input: FrameRangeItem): FrameRange {
        if (!(input instanceof FrameRangeItem))
            throw new TypeError(`Incorrect type of 'input', expected "FrameRangeItem", got "${typeof FrameRangeItem}"`);

        const range: FrameRangePair[] = input.getRange();

        for (let i = 0; i < range.length; i++) {
            const selfIndex = this.findIndex((candidate: FrameRangePair) => candidate.renumbered === range[i].renumbered);
            if (selfIndex > 0) {
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
                throw new TypeError(`Incorrect input tpe, expected "RangeFramePair", got "${typeof item}`);

            const index: number = this.searchIndexToInsert(item);
            if (this[index].renumbered === item.renumbered)
                this.splice(index, 1, item);
            else
                this.splice(index, 0, item);
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
            if (end - start === 1) return middle;

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
}
