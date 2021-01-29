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
  const { tagFilterExpression: tagFilterFormModel, rule } = alertConfigWithFormModel;
  const metricName = blueprintConfig.getMetricName(rule);
  const ruleTagFilterFormModel = blueprintConfig.getRuleTagFilterFormModel(rule);

  let numeratorFilter;

  const expressionsToCombine = [];
  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilterFormModel[0];
    expressionsToCombine.push(blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel, subEntityId));
  } else {
    expressionsToCombine.push(blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel, subEntityId));
    if (ruleTagFilterFormModel.length > 0) {
      expressionsToCombine.push(ruleTagFilterFormModel);
    }
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
