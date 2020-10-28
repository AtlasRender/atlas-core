/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/28/20, 4:02 PM
 * All rights reserved.
 */

/**
 * getFramesFromRange - returns array of frame numbers from frame range notation.
 * @function
 * @param range - Input information in range notation.
 * @throws RangeError
 * @throws SyntaxError
 * @author Danil Andreev
 */
export default function getFramesFromRange(range: string): number[] {
    const tokens = range.split(" ");
    const frames = [];
    const rangeRe = /([0-9]+)-([0-9]+)/;
    for (const token of tokens) {

        if (rangeRe.test(range)) {
            const [start, end] = rangeRe.exec(range);
            if (+end < +start) continue;
            //create array
        }
    }

    return [1, 2, 3];
}
