/*
 * Copyright (c) 2020. This code created and belongs to Pathfinder render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * File creator: Denis Afendikov
 * Project: pathfinder-core
 * File last modified: 05.10.2020, 18:52
 * All rights reserved.
 */

import {Column, Entity, ManyToOne, Timestamp} from "typeorm";
import BasicPlugin from "./BasicPlugin";

/**
 * GlobalPlugin - typeorm entity for global plugins data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class GlobalPlugin extends BasicPlugin {
}