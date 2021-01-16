/*
 * Copyright (c) 2021. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 1/15/21, 2:48 PM
 * All rights reserved.
 */

import Ref from "../interfaces/Ref";


/**
 * createRef - creates Ref object with passed value.
 * @function
 * @param value - Initial value.
 * @author Danil Andreev
 */
export default function createRef<T>(value: T): Ref<T> {
    return {current: value};
}
