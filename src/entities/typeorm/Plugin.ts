/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-core
 * File last modified: 11/12/20, 5:25 PM
 * All rights reserved.
 */

import {Entity, ManyToOne} from "typeorm";
import Organization from "./Organization";
import BasicPlugin from "./BasicPlugin";
import RenderJob from "./RenderJob";


/**
 * Plugin - typeorm entity for plugin data.
 * @class
 * @author Denis Afendikov
 */
@Entity()
export default class Plugin extends BasicPlugin {
    /**
     * organization - organization that plugin belongs to.
     */
    @ManyToOne(type => Organization, org => org.plugins)
    organization: Organization;

    /**
     * renderJobs - render jobs that plugin used by.
     */
    @ManyToOne(type => RenderJob, job => job.plugin)
    renderJobs: RenderJob[];
}
