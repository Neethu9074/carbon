/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TeamScope } from '@instana/types';

import { ApiTeam as Team } from 'in-settings/tabs/SecurityAndAccess/api/teams';

export interface ScopeAreaSection {
  id: string;
  title?: string;
  items: Array<any> | Array<string> | undefined;
}

export interface ScopeArea {
  id: string;
  title?: string;
  subtitle?: (scope: TeamScope | undefined) => string;
  items: (scope: TeamScope | undefined) => ScopeAreaSection[];
}

export interface ScopeOverviewProps {
  team: Team;
}
