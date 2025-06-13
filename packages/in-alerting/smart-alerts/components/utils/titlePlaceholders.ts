/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Group, GroupByTag } from '@instana/types';

import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { severityPlaceholder, Placeholder } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';

function isStringArray(arr: unknown[]): arr is string[] {
  return typeof arr[0] === 'string';
}

export function getAllowedPlaceholders({
  groupBy
}: {
  groupBy?: string[] | GroupByTag[];
}): ReadonlyArray<Readonly<Placeholder>> {
  if (!groupBy || groupBy.length === 0) {
    return [severityPlaceholder];
  }

  const tagNames = isStringArray(groupBy)
    ? groupBy
    : groupBy.map(({ tagName, key }) => (key ? `${tagName}.${key}` : tagName));

  const groupByPlaceholders = tagNames.map(groupbyTag => ({
    name: groupbyTag,
    template: '${' + groupbyTag + '}'
  }));

  return [...groupByPlaceholders, severityPlaceholder];
}

export function replaceTitlePlaceholdersWithMarkup(name: string, groupBy?: string[] | GroupByTag[]) {
  return replacePlaceholdersWithMarkup(getAllowedPlaceholders({ groupBy }), name);
}

export function groupbyForPlaceholder(groupBy?: Group): GroupByTag[] {
  if (!groupBy?.groupbyTag) {
    return [];
  }

  return [
    {
      tagName: groupBy.groupbyTag,
      key: groupBy.groupbyTagSecondLevelKey ?? undefined
    }
  ];
}
