/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { removeExcludedFilters } from 'in-alerting/smart-alerts/components/utils/tagfilterExpressionUtils';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';

/* eslint-env jest */

const availableTagFilter = {
  type: 'TAG_FILTER',
  name: 'AVAILABLE'
  // ...
};

const nonAvailableTagFilter = {
  type: 'TAG_FILTER',
  name: 'NOT_AVAILABLE'
  // ...
};

const expressionAND = {
  type: 'EXPRESSION',
  logicalOperator: 'AND'
  // ...
};

const expressionOR = {
  type: 'EXPRESSION',
  logicalOperator: 'OR'
  // ...
};

const availableTagFilters = [availableTagFilter.name];

describe('in-alerting/smart-alerts/components/utils/tagfilterExpressionUtils::removeExcludedFilters', () => {
  test('Return null if expression consists of only one non available filter', () => {
    const backendModel = nonAvailableTagFilter;
    const cleanedUpExpression = removeExcludedFilters(backendModel, availableTagFilters);
    expect(cleanedUpExpression).toMatchObject(emptyTagFilterExpression);
  });

  test('Return object containing the available object if expression consists of two filters where one of them is not available', () => {
    const backendModel = {
      ...expressionAND,
      elements: [nonAvailableTagFilter, availableTagFilter]
    };

    const cleanedUpExpression = removeExcludedFilters(backendModel, availableTagFilters);
    expect(cleanedUpExpression).toMatchObject({
      ...expressionAND,
      elements: [availableTagFilter]
    });
  });

  test('Multivel nested expression containing non available filters', () => {
    const backendModel = {
      ...expressionOR,
      elements: [
        {
          ...expressionAND,
          elements: [availableTagFilter, availableTagFilter]
        },
        {
          ...expressionAND,
          elements: [
            {
              ...expressionOR,
              elements: [
                {
                  ...expressionAND,
                  elements: [nonAvailableTagFilter, availableTagFilter]
                },
                {
                  ...expressionOR,
                  elements: [
                    {
                      ...expressionAND,
                      elements: [availableTagFilter, availableTagFilter]
                    },
                    {
                      ...expressionAND,
                      elements: [nonAvailableTagFilter, nonAvailableTagFilter]
                    }
                  ]
                }
              ]
            },
            availableTagFilter
          ]
        }
      ]
    };

    const cleanedUpExpression = removeExcludedFilters(backendModel, availableTagFilters);

    expect(cleanedUpExpression).toMatchObject({
      ...expressionOR,
      elements: [
        {
          ...expressionAND,
          elements: [availableTagFilter, availableTagFilter]
        },
        {
          ...expressionAND,
          elements: [
            {
              ...expressionOR,
              elements: [
                {
                  ...expressionAND,
                  elements: [availableTagFilter]
                },
                {
                  ...expressionOR,
                  elements: [
                    {
                      ...expressionAND,
                      elements: [availableTagFilter, availableTagFilter]
                    },
                    {
                      ...expressionAND,
                      elements: []
                    }
                  ]
                }
              ]
            },
            availableTagFilter
          ]
        }
      ]
    });
  });
});
