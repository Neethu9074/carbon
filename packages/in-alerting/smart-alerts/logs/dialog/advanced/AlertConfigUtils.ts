/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Group } from '@instana/types';

// TODO can be removed later
export function toBackendGroupBy(groupBy?: Group[]) {
  if (!groupBy) {
    return [];
  }
  return groupBy?.filter(g => g?.groupbyTag).map(g => toGroupTag(g));
}

export function toGroupTag(group: Group) {
  return group?.groupbyTagSecondLevelKey ? group.groupbyTag + '.' + group.groupbyTagSecondLevelKey : group.groupbyTag;
}

export function toGroupByTag(groupBy: Group[]) {
  return groupBy.map(group => ({ tagname: group.groupbyTag, key: group?.groupbyTagSecondLevelKey ?? null }));
}
