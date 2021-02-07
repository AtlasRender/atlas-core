/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import {Entity} from "typeorm";
import BasicPlugin from "./BasicPlugin";


/**
 * GlobalPlugin - typeorm entity for global plugins data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class GlobalPlugin extends BasicPlugin {
}
