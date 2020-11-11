/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Danil Andreev
 * Project: atlas-core
 * File last modified: 10.11.2020, 22:07
 * All rights reserved.
 */

import {ReadStream} from "fs";


/**
 * streamToBuffer - converts read stream to buffer.
 * @param stream Read stream.
 * @author Danil Andreev
 * @throws Error
 */
export default function streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on("error", reject);
        stream.on("data", (data) => buffers.push(data));
        stream.on("end", () => resolve(Buffer.concat(buffers)));
    });
}
