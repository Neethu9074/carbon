/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Group, GroupByTag, InfraAlertEvaluationType } from '@instana/types';

import {
  severityPlaceholder,
  Placeholder,
  entityLabelPlaceholder
} from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
import { perEntityEvaluationType } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/CustomOrPerEntityOption';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';

function isStringArray(arr: unknown[]): arr is string[] {
  return typeof arr[0] === 'string';
}

export function getAllowedPlaceholders({
  groupBy,
  evaluationType
}: {
  groupBy?: string[] | GroupByTag[];
  evaluationType?: InfraAlertEvaluationType;
}): ReadonlyArray<Readonly<Placeholder>> {
  if (!groupBy || groupBy.length === 0) {
    if (evaluationType === perEntityEvaluationType) {
      return [entityLabelPlaceholder, severityPlaceholder];
    }
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

export function replaceTitlePlaceholdersWithMarkup(
  name: string,
  groupBy?: string[] | GroupByTag[],
  evaluationType?: InfraAlertEvaluationType
) {
  return replacePlaceholdersWithMarkup(getAllowedPlaceholders({ groupBy, evaluationType }), name);
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
