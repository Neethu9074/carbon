/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { getFilterGroupExpression, groupExpressionProps } from 'in-events/components/EventContent/InfraEventContent';
import { fromBackendModel, removeSurroundingBrackets } from 'in-components/QueryBuilder/transformation/formModel';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { deepCopy } from 'in-services/util/object';

export function InfraGrouping({
  AlertQueryBuilder,
  groupingTags
}: {
  AlertQueryBuilder: QueryBuilderComponent<{}>;
  groupingTags: groupExpressionProps[];
}) {
  const groupingKeys = Object.keys(groupingTags);
  if (!groupingKeys.length) {
    return null;
  }

  const groupByExpression = getFilterGroupExpression(deepCopy(EMPTY_EXPRESSION), groupingTags);
  const groupByExpressionModel = removeSurroundingBrackets(fromBackendModel(groupByExpression));
  return <AlertQueryBuilder value={groupByExpressionModel} readOnly />;
}
