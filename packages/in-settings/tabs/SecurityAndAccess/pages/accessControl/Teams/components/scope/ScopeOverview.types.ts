/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, Team, TeamScope, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

export interface ScopeAreaSection<I> {
  id: string;
  title?: string;
  items: Array<string> | undefined;
  observable: () => Observable<Result<I[]>>;
  extractId: (entity: I) => string;
  extractName: (entity: I) => string;
}

export interface ScopeArea<I> {
  id: string;
  title?: string;
  subtitle?: (scope: TeamScope | undefined) => string;
  items: (scope: TeamScope | undefined, timeConfig: TimeConfig) => ScopeAreaSection<I>[];
}

export interface ScopeOverviewProps {
  team: Team;
}
