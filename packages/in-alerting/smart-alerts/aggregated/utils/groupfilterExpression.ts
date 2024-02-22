/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagFilter } from '@instana/types';

import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

export function getGroupingFE(groupBy: string[]) {
  if (!groupBy.length) {
    return [];
  }
  const groupingFE: TagFilter[] = [];
  groupBy.forEach((groupName: string) => {
    groupingFE.push({
      value: '',
      //@ts-expect-error groupby doesnot have operator
      operator: '',
      name: groupName,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  });
  return groupingFE;
}
