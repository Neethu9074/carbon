/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TeamScope } from '@instana/types';

import { ApiTeam as Team } from 'in-settings/tabs/SecurityAndAccess/api/teams';

export interface TeamScopeAreaSection {
  id: string;
  title?: string;
  items: Array<any> | Array<string> | undefined;
}

export interface TeamScopeArea {
  id: string;
  title?: string;
  subtitle?: (scope: TeamScope | undefined) => string;
  items: (scope: TeamScope | undefined) => TeamScopeAreaSection[];
}

export interface TeamScopeOverviewProps {
  team: Team;
}
