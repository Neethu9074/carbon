/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { updateMultiThresholdInForm } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

// Remove thresholds with "Infinity" values to avoid chart rendering issues.
// TODO: Remove this once the backend is fixed.
const filterOutThresholdResultInfinityValues = thresholdResult => {
  if (!Array.isArray(thresholdResult?.data?.baseline)) {
    return thresholdResult;
  }

  const filteredBaseline = thresholdResult.data.baseline.filter(
    ([timestamp, baseline, bound]) => Number.isFinite(baseline) && Number.isFinite(bound)
  );

  return {
    ...thresholdResult,
    data: {
      ...thresholdResult.data,
      baseline: filteredBaseline
    }
  };
};

export default function useThresholdSuggestion(form, updateForm, setThresholdResult, createThresholdForm, config) {
  const { isValid, simpleMode, alertConfigWithFormModel, blueprintConfig } = config;
  const thresholdResult = useObservable(
    ([simpleMode, isValid]) => resolveThresholdRequest(alertConfigWithFormModel, blueprintConfig, simpleMode, isValid),
    [simpleMode, isValid, form]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    const patchedThresholdResult = filterOutThresholdResultInfinityValues(thresholdResult);

    setThresholdResult(patchedThresholdResult);
    const { data, errors, time } = patchedThresholdResult;

    if (isValid) {
      updateMultiThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}

function resolveThresholdRequest(alertConfigWithFormModel, blueprintConfig, isSimpleMode, isValid) {
  const {
    threshold,
    rule,
    rule: { metricName },
    granularity,
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;

  if (!isValid || !calculateThresholdOnBackend) {
    return empty;
  }

  const { operator, warningThreshold, criticalThreshold } = threshold;

  const validThreshold = warningThreshold?.type ? warningThreshold : criticalThreshold;

  const { enrichedTagFilterFormModel, numeratorTagFilterFormModel } = getEnhancedTagFilterFormModel(
    alertConfigWithFormModel,
    blueprintConfig
  );

  const getSeasonality = () => {
    if (!blueprintConfig.baselineEnabled) {
      // request static threshold
      return null;
    }
    // In simple mode, user does not have a choice to change threshold type, so we set it to HISTORIC_BASELINE for
    // blueprint where baseline is enabled and here we need to select DAILY seasonality as default!
    return isSimpleMode ? DAILY : validThreshold?.seasonality;
  };

  const thresholdSuggestionRequest = blueprintConfig.getThresholdSuggestionRequest(metricName);

  return thresholdSuggestionRequest({
    tagFilterExpression: toBackendQueryModel(enrichedTagFilterFormModel),
    metric: {
      metric: blueprintConfig.getMetricName(rule),
      granularity,
      aggregation: blueprintConfig.getAggregation(rule),
      numeratorTagFilterExpression: toBackendQueryModel(numeratorTagFilterFormModel)
    },
    operator,
    seasonality: getSeasonality(),
    adaptability: warningThreshold?.adaptability || criticalThreshold?.adaptability,
    fallbackOnError: isSimpleMode,
    type: validThreshold?.type
  });
}
