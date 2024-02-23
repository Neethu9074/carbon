/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { TagFilterExpression } from 'in-types';

export interface GroupingTag {
  [key: string]: string;
}

export function getExpressionWithGroupingTags(
  tagFilterExpression: TagFilterExpression,
  groupingTags: GroupingTag[]
): TagFilterExpression {
  const groupingKeys = Object.keys(groupingTags);
  if (!groupingKeys.length) {
    return tagFilterExpression;
  }

  const groupingTFE: TagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

  groupingKeys.map(key => {
    const groupExpression = tagFilter(key, EQUALS, groupingTags[key as keyof typeof groupingTags]);
    groupingTFE.elements.push(groupExpression);
  });

  return { type: 'EXPRESSION', logicalOperator: 'AND', elements: [tagFilterExpression, groupingTFE] };
}
