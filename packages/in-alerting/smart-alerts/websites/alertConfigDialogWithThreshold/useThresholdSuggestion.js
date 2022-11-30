/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export default function useThresholdSuggestion(form, updateForm, setThresholdResult, config) {
  const {
    isValid,
    simpleMode,
    alertConfigWithFormModel,
    blueprintConfig,
    enrichedTagFilterFormModel,
    numeratorTagFilterFormModel
  } = config;
  const thresholdResult = useObservable(
    ([simpleMode, isValid]) =>
      resolveThresholdRequest(
        alertConfigWithFormModel,
        blueprintConfig,
        enrichedTagFilterFormModel,
        numeratorTagFilterFormModel,
        simpleMode,
        isValid
      ),
    [simpleMode, isValid, form]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    setThresholdResult(thresholdResult);
    const { data, errors, time } = thresholdResult;
    if (isValid) {
      updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}

function resolveThresholdRequest(
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  numeratorTagFilterFormModel,
  isSimpleMode,
  isValid
) {
  const {
    rule: { metricName },
    rule,
    threshold: { operator, seasonality = null, type },
    granularity,
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;

  if (!isValid || !calculateThresholdOnBackend) {
    return empty;
  }

  const getSeasonality = () => {
    if (!blueprintConfig.baselineEnabled) {
      // request static threshold
      return null;
    }
    // In simple mode, user does not have a choice to change threshold type, so we set it to HISTORIC_BASELINE for
    // blueprint where baseline is enabled and here we need to select DAILY seasonality as default!
    return isSimpleMode ? DAILY : seasonality;
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
    fallbackOnError: isSimpleMode,
    type
  });
}
