/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagFilterExpressionElementUnion } from '@instana/types';

import {
  OPERATOR_AND,
  createTagFilterExpression,
  isEmptyExpression
} from 'in-components/QueryBuilder/transformation/backendQueryModel';

export function limitWithContributionFilter(
  tagFilterExpression?: TagFilterExpressionElementUnion,
  contributionFilter?: TagFilterExpressionElementUnion
): TagFilterExpressionElementUnion | undefined {
  if (isEmptyExpression(contributionFilter)) {
    return tagFilterExpression;
  }
  if (isEmptyExpression(tagFilterExpression)) {
    return contributionFilter;
  }
  return createTagFilterExpression(OPERATOR_AND, [tagFilterExpression!, contributionFilter!]);
}
