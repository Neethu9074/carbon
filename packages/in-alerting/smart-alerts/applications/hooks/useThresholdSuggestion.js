/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { isValidChartViewEntitySelection } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export function useThresholdSuggestion(form, updateForm, setThresholdResult, config) {
  const {
    isGlobalSmartAlert,
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

    const isAdaptiveBaseline = alertConfigWithFormModel.threshold.type === ADAPTIVE_BASELINE;

    if ((!isGlobalSmartAlert || isAdaptiveBaseline) && isValid) {
      updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
    }

    if (isGlobalSmartAlert && !isAdaptiveBaseline) {
      updateForm(form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}

function isValidEntitySelection(alertConfigWithFormModel) {
  const {
    threshold: { type }
  } = alertConfigWithFormModel;

  if (type !== ADAPTIVE_BASELINE) {
    return true;
  }

  const {
    evaluationType,
    hiddenFields: { chartViewEntitySelection }
  } = alertConfigWithFormModel;

  return isValidChartViewEntitySelection(evaluationType, chartViewEntitySelection);
}

function shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel) {
  const {
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;

  return !isValid || !calculateThresholdOnBackend || !isValidEntitySelection(alertConfigWithFormModel);
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
    includeInternal,
    includeSynthetic,
    granularity,
    evaluationType
  } = alertConfigWithFormModel;

  if (shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel)) {
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
    includeInternal,
    includeSynthetic,
    metric: {
      metric: blueprintConfig.getMetricName(rule),
      granularity,
      aggregation: blueprintConfig.getAggregation(rule),
      numeratorTagFilterExpression: toBackendQueryModel(numeratorTagFilterFormModel)
    },
    operator,
    seasonality: getSeasonality(),
    evaluationType: type === ADAPTIVE_BASELINE ? null : evaluationType,
    fallbackOnError: isSimpleMode,
    type
  });
}
