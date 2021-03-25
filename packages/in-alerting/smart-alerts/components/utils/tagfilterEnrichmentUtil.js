/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';

export function getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig, applicationId, subEntityId) {
  const { tagFilterExpression: tagFilterFormModel, rule } = alertConfigWithFormModel;
  const metricName = blueprintConfig.getMetricName(rule);
  const ruleTagFilterFormModel = blueprintConfig.getRuleTagFilterFormModel(rule);

  let numeratorFilter;

  const expressionsToCombine = [
    blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel, applicationId, null, subEntityId)
  ];
  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilterFormModel[0];
  } else if (ruleTagFilterFormModel.length > 0) {
    expressionsToCombine.push(ruleTagFilterFormModel);
  }
  if (tagFilterFormModel?.length > 0) {
    expressionsToCombine.push(tagFilterFormModel);
  }

  return {
    numeratorFilter,
    enrichedTagFilterFormModel: joinExpressions({
      expressions: expressionsToCombine
    })
  };
}
