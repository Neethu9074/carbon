/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { TagFilterExpressionElementUnion } from '@instana/types';
/**
 * Recursively go through the expression tree and count the number of tag filters.
 *
 * @param {Object} tagFilterExpression the backend model of the tag-filter expression.
 * @returns count of tagFilters, recursively collected
 */
export function countTagFilters(tagFilterExpression: TagFilterExpressionElementUnion): number {
  if (tagFilterExpression.type === 'TAG_FILTER') {
    return 1;
  }

  let { elements = [] } = tagFilterExpression;

  if (tagFilterExpression.type === 'EXPRESSION' && elements.length === 0) {
    return 0;
  }

  let cnt = 0;

  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];

    if (element.type === 'EXPRESSION') {
      cnt += countTagFilters(element);
    }

    if (element.type === 'TAG_FILTER') {
      cnt++;
    }
  }

  return cnt;
}
