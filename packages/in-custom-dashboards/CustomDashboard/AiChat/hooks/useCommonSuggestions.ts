/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CommonInferredConfig, CommonPossibleConfig } from 'in-custom-dashboards/CustomDashboard/AiChat/types';
import { availableMetrics } from 'in-applications/analyze/metrics';

/**
 * structure suggestions for common widgets like Big Number, Time Series Chart and Pie Chart
 * @info these suggestions are currently heavily focused on calls and their metrics. This will be changed in the future
 * @param inferredConfig all final slots that are available
 * @param possibleConfig all possible slots we receive from backend
 * @returns suggestions for those slots, that could not be identified
 */
export const useCommonSuggestions = (
  inferredConfig: CommonInferredConfig | null,
  possibleConfig: CommonPossibleConfig | null
) => {
  let suggestions: CommonPossibleConfig = {};

  if (!inferredConfig?.metric) {
    suggestions.metrics = possibleConfig?.metrics ?? availableMetrics.map(metric => metric.label);
  }

  if (!inferredConfig?.aggregation) {
    suggestions.aggregations =
      possibleConfig?.aggregations ??
      (availableMetrics.find(({ availableMetric }) => availableMetric === inferredConfig?.metric)
        ?.supportedAggregations ||
        inferredConfig?.aggregation || ['MEAN', 'MAX', 'SUM']);
  }

  if (!inferredConfig?.filter && possibleConfig?.filters) {
    suggestions.filters = possibleConfig.filters;
  }

  return suggestions;
};
