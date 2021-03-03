/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 21.02.2021, 0:18
 * All rights reserved.
 */

const Logger = jest.createMockFromModule("../Logger");

/* eslint no-console: 0 */
/* eslint @typescript-eslint/ban-ts-comment: 0 */

// @ts-ignore
Logger.log = ((level, options) =>
        async (...params: any[]): Promise<void> => console.log(params)
);

// @ts-ignore
Logger.error = ((options) =>
        async (...params: any[]): Promise<void> => console.error(params)
);

// @ts-ignore
Logger.warn = ((options) =>
        async (...params: any[]): Promise<void> => console.warn(params)
);

// @ts-ignore
Logger.info = ((options) =>
        async (...params: any[]): Promise<void> => console.info(params)
);

export default Logger;