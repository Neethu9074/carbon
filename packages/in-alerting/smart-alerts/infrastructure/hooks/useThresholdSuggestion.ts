/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import { useEffect } from 'react';

//@ts-ignore
import { Observable, empty } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getInfraMetricsThresholdSuggestion from 'in-alerting/smart-alerts/infrastructure/subscriptions/getInfraMetricsThresholdSuggestion';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getEnrichedTagFilterExpression } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import createThresholdForm from 'in-alerting/smart-alerts/infrastructure/form/thresholdForm';
import { MetricDataSeries } from 'in-applications/subscriptions/types';
import { Result } from 'in-types';

export default function useThresholdSuggestion(
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  setThresholdResult: React.Dispatch<React.SetStateAction<Result<MetricDataSeries> | any>>,
  config: any
) {
  const { isValid, alertConfigWithFormModel } = config;
  const thresholdResult = useObservable(
    ([isValid]) => resolveThresholdRequest(alertConfigWithFormModel, isValid),
    [isValid, form]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    setThresholdResult(thresholdResult);
    const { data, errors, time } = thresholdResult;

    if (isValid) {
      // @ts-ignore
      updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}

function shouldSkipFetchingThresholdSuggestion(
  isValid: boolean,
  alertConfigWithFormModel: InfraSmartAlertConfigWithMetadata & {
    hiddenFields: { calculateThresholdOnBackend: boolean };
  }
) {
  const {
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;

  return !isValid || !calculateThresholdOnBackend;
}

function resolveThresholdRequest(
  alertConfigWithFormModel: InfraSmartAlertConfigWithMetadata & {
    hiddenFields: { calculateThresholdOnBackend: boolean };
  },
  isValid: boolean
): Observable<Result<MetricDataSeries>> {
  const {
    rule: { metricName, aggregation, entityType, crossSeriesAggregation, regex },
    threshold: { operator, type },
    granularity,
    tagFilterExpression
  } = alertConfigWithFormModel;

  if (shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel)) {
    return empty;
  }

  const enrichedTagFilterExpression = getEnrichedTagFilterExpression(tagFilterExpression, undefined);

  return getInfraMetricsThresholdSuggestion({
    tagFilterExpression: enrichedTagFilterExpression,
    metric: {
      metric: metricName,
      granularity,
      aggregation,
      type: entityType,
      crossSeriesAggregation,
      regex
    },
    operator,
    fallbackOnError: true,
    type
  });
}
