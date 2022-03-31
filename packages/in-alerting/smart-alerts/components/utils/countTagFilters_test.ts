/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { countTagFilters } from 'in-alerting/smart-alerts/components/utils/countTagFilters';
import { TagFilter, TagFilterExpression } from 'in-types';

const tagFilter = {
  type: 'TAG_FILTER',
  name: 'AVAILABLE'
  // ...
} as TagFilter;

const expression = {
  type: 'EXPRESSION',
  logicalOperator: 'AND'
  // ...
} as TagFilterExpression;

describe('in-alerting/smart-alerts/components/utils/countTagFilters#countTagFilters', () => {
  test('number of tagFilters on an empty expression is 0', () => {
    expect(countTagFilters(emptyTagFilterExpression)).toBe(0);
  });

  test('number of tagFilters in an expression with one element is 1', () => {
    expect(countTagFilters(tagFilter)).toBe(1);
  });

  test('number of tagFilters in an expression with a combination of two elements is 2', () => {
    const backendModel = {
      ...expression,
      elements: [tagFilter, tagFilter]
    };

    expect(countTagFilters(backendModel)).toBe(2);
  });

  test('number of tagFilters in a multi level expression with 9 filters is 9', () => {
    const backendModel = {
      ...expression,
      elements: [
        {
          ...expression,
          elements: [tagFilter, tagFilter]
        },
        {
          ...expression,
          elements: [
            {
              ...expression,
              elements: [
                {
                  ...expression,
                  elements: [tagFilter, tagFilter]
                },
                {
                  ...expression,
                  elements: [
                    {
                      ...expression,
                      elements: [tagFilter, tagFilter]
                    },
                    {
                      ...expression,
                      elements: [tagFilter, tagFilter]
                    }
                  ]
                }
              ]
            },
            tagFilter
          ]
        }
      ]
    };

    expect(countTagFilters(backendModel)).toBe(9);
  });
});
