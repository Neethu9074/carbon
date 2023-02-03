/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sanitizeTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';

export function getEnhancedTagFilterFormModel(
  alertConfigWithFormModel,
  blueprintConfig,
  applicationId,
  serviceId,
  endpointId
) {
  const { tagFilterExpression: tagFilterFormModel, rule } = alertConfigWithFormModel;
  const metricName = blueprintConfig.getMetricName(rule);
  const ruleTagFilterFormModel = blueprintConfig.getRuleTagFilterFormModel(rule);

  let numeratorTagFilterFormModel;

  const expressionsToCombine = [
    blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel, applicationId, null, serviceId, endpointId)
  ];
  if (blueprintConfig.isCustomRateMetric(metricName)) {
    numeratorTagFilterFormModel = ruleTagFilterFormModel;
  } else if (ruleTagFilterFormModel.length > 0) {
    expressionsToCombine.push(ruleTagFilterFormModel);
  }
  if (tagFilterFormModel?.length > 0) {
    expressionsToCombine.push(tagFilterFormModel);
  }

  return {
    numeratorTagFilterFormModel,
    enrichedTagFilterFormModel: sanitizeStringTagFilters(
      joinExpressions({
        expressions: expressionsToCombine
      })
    )
  };
}

function sanitizeStringTagFilters(tagFilterExpressionFormModel) {
  return tagFilterExpressionFormModel.map(sanitizeTagFilter);
}
