/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, Team, TeamScope, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

/**
 * Model for area section of a scope (basically a subsection of a scope area).
 * @property {string} id - unique id of the section
 * @property {string} title - title of the section
 * @property {Array<string> | undefined} items - items to be displayed in the section
 * @property {() => Observable<Result<I[]>>} observable - observable for mapping item id to a name
 * @property {(entity: I) => string} extractId - function to extract the id of an item
 * @property {(entity: I) => string} extractName - function to extract the name of an item
 * @property {string} displayType - Defines how to display the items either 'list' where each item
 *                                  is a row or 'tagSet' where all items are shown as tag set in one single list row.
 */
export interface ScopeAreaSection<I> {
  id: string;
  title?: string;
  items: Array<string> | undefined;
  observable: () => Observable<Result<I[]>>;
  extractId: (entity: I) => string;
  extractName: (entity: I) => string;
  displayType?: 'list' | 'tagSet';
}

/**
 * Model for a scope area that is shown in the scope overview.
 * @property {string} id - unique id of the area
 * @property {string} title - title of the area
 * @property {(scope: TeamScope | undefined) => string} subtitle - function to return subtitle shown below the title
 * @property {(scope: TeamScope | undefined, timeConfig: TimeConfig) => ScopeAreaSection<I>[]} items - function to obtain items to be displayed in the area section
 */
export interface ScopeArea<I> {
  id: string;
  title?: string;
  subtitle?: (scope: TeamScope | undefined) => string;
  items: (scope: TeamScope | undefined, timeConfig: TimeConfig) => ScopeAreaSection<I>[];
}

export interface ScopeOverviewProps {
  team: Team;
}
