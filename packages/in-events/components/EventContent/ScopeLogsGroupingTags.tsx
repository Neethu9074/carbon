/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SelectedMetric, getExpressionWithLogsGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import { fromBackendModel, removeSurroundingBrackets } from 'in-components/QueryBuilder/transformation/formModel';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { deepCopy } from 'in-services/util/object';

export function ScopeGroupingTags({
  AlertQueryBuilder,
  groupingTags
}: {
  AlertQueryBuilder: QueryBuilderComponent<{}>;
  groupingTags: SelectedMetric[];
}) {
  if (!groupingTags.length) {
    return null;
  }

  const groupByExpression = getExpressionWithLogsGroupingTags(deepCopy(EMPTY_EXPRESSION), groupingTags);
  const groupByExpressionModel = removeSurroundingBrackets(fromBackendModel(groupByExpression));

  return <AlertQueryBuilder value={groupByExpressionModel} readOnly />;
}
