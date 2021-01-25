/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { AND_CONJUNCTION } from './queryUtils';

export function getEnhancedTagFilters(alertConfigWithFormModel, blueprintConfig) {
  const { tagFilters, rule } = alertConfigWithFormModel;
  const metricName = blueprintConfig.getMetricName(rule);
  const ruleTagFilters = blueprintConfig.getRuleTagFilters(rule);

  let numeratorFilter;
  let enrichedTagFilters;

  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilters[0];
    enrichedTagFilters = [...tagFilters, ...blueprintConfig.getEntityTagFilters(alertConfigWithFormModel)];
  } else {
    enrichedTagFilters = [
      ...tagFilters,
      ...ruleTagFilters,
      ...blueprintConfig.getEntityTagFilters(alertConfigWithFormModel)
    ];
  }

  return { numeratorFilter, enrichedTagFilters };
}

export function getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig) {
  const { tagFilterExpression: tagFilterFormModel, rule } = alertConfigWithFormModel;
  const metricName = blueprintConfig.getMetricName(rule);
  const ruleTagFilterFormModel = blueprintConfig.getRuleTagFilterFormModel(rule);

  let numeratorFilter;

  const enrichedTagFilterFormModel = [];
  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilterFormModel[0];
    enrichedTagFilterFormModel.push(...blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel));
  } else {
    enrichedTagFilterFormModel.push(...blueprintConfig.getEntityTagFilterFormModel(alertConfigWithFormModel));
    if (ruleTagFilterFormModel.length > 0) {
      enrichedTagFilterFormModel.push(AND_CONJUNCTION, ...ruleTagFilterFormModel);
    }
  }
  if (tagFilterFormModel?.length > 0) {
    enrichedTagFilterFormModel.push(AND_CONJUNCTION, ...tagFilterFormModel); // FIXME Verify: if the expression is using OR, aren't we missing brackets here!?
  }

  return { numeratorFilter, enrichedTagFilterFormModel: enrichedTagFilterFormModel };
}
