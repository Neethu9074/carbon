/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';

export function getEnhancedTagFilters(alertConfigWithFormModel, blueprintConfig, subEntityId) {
  const { tagFilters, rule } = alertConfigWithFormModel;
  const metricName = blueprintConfig.getMetricName(rule);
  const ruleTagFilters = blueprintConfig.getRuleTagFilters(rule);

  let numeratorFilter;
  let enrichedTagFilters;

  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilters[0];
    enrichedTagFilters = [...tagFilters, ...blueprintConfig.getEntityTagFilters(alertConfigWithFormModel, subEntityId)];
  } else {
    enrichedTagFilters = [
      ...tagFilters,
      ...ruleTagFilters,
      ...blueprintConfig.getEntityTagFilters(alertConfigWithFormModel, subEntityId)
    ];
  }

  return { numeratorFilter, enrichedTagFilters };
}

export function getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig, subEntityId) {
  // TODO AP ID must be provided via selection as well for Global SmartAlerts, and also as a separate parameter
  //      for non-global SmartAlerts, because this field is deprecated.
  const { applicationId } = alertConfigWithFormModel;

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
