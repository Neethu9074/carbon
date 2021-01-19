/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { AND_CONJUNCTION } from './queryUtils';

export function getEnhancedTagFilters(alertConfig, blueprintConfig) {
  const metricName = blueprintConfig.getMetricName(alertConfig.rule);
  const ruleTagFilters = blueprintConfig.getRuleTagFilters(alertConfig.rule);

  let numeratorFilter;
  let enrichedTagFilters;

  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilters[0];
    enrichedTagFilters = [...alertConfig.tagFilters, blueprintConfig.getEntityTagFilter(alertConfig)];
  } else {
    enrichedTagFilters = [
      ...alertConfig.tagFilters,
      ...ruleTagFilters,
      blueprintConfig.getEntityTagFilter(alertConfig)
    ];
  }

  return { numeratorFilter, enrichedTagFilters };
}

export function getEnhancedTagFilterExpression(alertConfig, blueprintConfig) {
  const metricName = blueprintConfig.getMetricName(alertConfig.rule);
  const ruleTagFilterExpression = blueprintConfig.getRuleTagFilterExpression(alertConfig.rule);

  let numeratorFilter;
  let enrichedTagFilterExpression;

  enrichedTagFilterExpression = [];
  if (alertConfig.tagFilterExpression?.length > 0) {
    enrichedTagFilterExpression.push(...alertConfig.tagFilterExpression, AND_CONJUNCTION);
  }
  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilterExpression[0];
    enrichedTagFilterExpression.push(blueprintConfig.getEntityTagFilterExpression(alertConfig));
  } else {
    enrichedTagFilterExpression.push(blueprintConfig.getEntityTagFilterExpression(alertConfig));
    if (ruleTagFilterExpression.length > 0) {
      enrichedTagFilterExpression.push(AND_CONJUNCTION, ...ruleTagFilterExpression);
    }
  }

  return { numeratorFilter, enrichedTagFilterExpression };
}
