/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MinimalTagDefinition } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { Group, TagFilterExpression } from 'in-types';

export interface GroupingTag {
  [key: string]: string;
}

export interface SelectedMetric extends Group {
  groupbyValue?: string;
}

//  function converts the groupy {} to a tagFilterExpression for Infra events.
export function getExpressionWithGroupingTags(
  tagFilterExpression: TagFilterExpression,
  groupingTags: Record<string, string | number>,
  isInfraSmartAlert: boolean = false
): TagFilterExpression {
  const groupingKeys = Object.keys(groupingTags);
  if (!groupingKeys.length) {
    return tagFilterExpression;
  }

  const groupingTFE: TagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

  groupingKeys.map(key => {
    let minimalTagDefinition: MinimalTagDefinition | undefined = undefined;
    if (key.startsWith('id.') && isInfraSmartAlert) {
      minimalTagDefinition = {
        availability: [],
        name: key,
        path: [{ label: 'Infra' }, { label: key }],
        type: 'STRING'
      };
    }
    const groupExpression = tagFilter(
      key,
      EQUALS,
      groupingTags[key as keyof typeof groupingTags],
      undefined,
      undefined,
      minimalTagDefinition
    );

    groupingTFE.elements.push({ ...groupExpression });
  });

  return { type: 'EXPRESSION', logicalOperator: 'AND', elements: [tagFilterExpression, groupingTFE] };
}

// function converts the groupy {} to a tagFilterExpression for Logs.
export function getExpressionWithLogsGroupingTags(
  tagFilterExpression: TagFilterExpression,
  groupingTags: SelectedMetric[]
): TagFilterExpression {
  if (!groupingTags.length) {
    return tagFilterExpression;
  }
  const groupingTFE: TagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

  groupingTags?.map(group => {
    const groupExpression = tagFilter(group.groupbyTag, EQUALS, group?.groupbyValue, group?.groupbyTagSecondLevelKey);
    groupingTFE.elements.push(groupExpression);
  });

  return { type: 'EXPRESSION', logicalOperator: 'AND', elements: [tagFilterExpression, groupingTFE] };
}
