/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { fromBackendModel, removeSurroundingBrackets } from 'in-components/QueryBuilder/transformation/formModel';
import { getExpressionWithGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { deepCopy } from 'in-services/util/object';

export function ScopeGroupingTags({
  AlertQueryBuilder,
  groupingTags
}: {
  AlertQueryBuilder: QueryBuilderComponent<{}>;
  groupingTags: Record<string, string | number>;
}) {
  const groupingKeys = Object.keys(groupingTags);
  if (!groupingKeys.length) {
    return null;
  }

  const groupByExpression = getExpressionWithGroupingTags(deepCopy(EMPTY_EXPRESSION), groupingTags);
  const groupByExpressionModel = removeSurroundingBrackets(fromBackendModel(groupByExpression));
  return <AlertQueryBuilder value={groupByExpressionModel} readOnly />;
}
