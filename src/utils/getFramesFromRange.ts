/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: pathfinder-core
 * File last modified: 10/28/20, 4:02 PM
 * All rights reserved.
 */

import * as _ from "lodash";


/**
 * getFramesFromRange - returns array of frame numbers from frame range notation.
 * @function
 * @param range - Input information in range notation.
 * @throws SyntaxError
 * @author Danil Andreev
 */
export default function getFramesFromRange(range: string): number[] {
    const tokens: string[] = range.split(" ");
    const frames = new Set<number>();
    const rangeRe = /([0-9]+)-([0-9]+)/;
    const singleRe = /([0-9]+)/;
    for (const token of tokens) {
        if (rangeRe.test(token)) {
            const [, start, end] = rangeRe.exec(token);
            if (+end < +start) continue;
            const localFrames = _.range(+start, +end + 1);
            for (const frame of localFrames) {
                frames.add(frame);
            }
        } else if (singleRe.test(token)) {
            frames.add(+token);
        } else {
            throw new SyntaxError(`Incorrect syntax at or near "${token}".`);
        }
    }

    return [...frames];
}
