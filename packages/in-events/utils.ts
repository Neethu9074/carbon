/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TimeConfig } from 'in-types';

function getExplicitEventFilter(eventFilter?: string) {
  if (!eventFilter) {
    // If no eventFilter is set, this means "All" events selected but should filter Monitoring Events
    return `!event.type:agent_monitoring_issue AND !event.type:cve_issue AND !event.type:prc_issue`;
  } else if (eventFilter === 'change') {
    return 'event.type:changeAndPresence';
  } else {
    return `event.type:${eventFilter}`;
  }
}

export function concatQueries(userQuery: string | undefined, eventFilter?: string) {
  const explicitEventFilter = getExplicitEventFilter(eventFilter);

  if (userQuery) {
    return `(${userQuery}) AND (${explicitEventFilter})`;
  }
  return explicitEventFilter;
}

export function spreadTimeConfig(staticTimeConfigToUseForTable: TimeConfig | undefined, timeConfig: TimeConfig) {
  timeConfig = staticTimeConfigToUseForTable ?? timeConfig;
  return [timeConfig.to, timeConfig.windowSize, timeConfig.autoRefresh, timeConfig.focusedMoment];
}
