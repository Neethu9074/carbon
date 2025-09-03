/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import { useEffect } from 'react';

import {
  Result,
  ThresholdConfigUnion,
  Seasonality,
  ThresholdSuggestionResponse,
  TagFilterExpression
} from '@instana/types';
// @ts-expect-error '@instana/observables' does not export 'empty'
import { Observable, empty } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getLogMetricsThresholdSuggestion from 'in-alerting/smart-alerts/logs/subscriptions/getLogMetricsThresholdSuggestion';
import { getExpressionWithLogsGroupingTags, SelectedMetric } from 'in-events/components/EventContent/tagFilterUtils';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { updateMultiThresholdInForm } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import createThresholdForm from 'in-alerting/smart-alerts/logs/form/thresholdForm';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

const metricName = 'logs_distribution';

export default function useThresholdSuggestion(
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  setThresholdResult: React.Dispatch<React.SetStateAction<Result<ThresholdSuggestionResponse> | any>>,
  editMode: boolean,
  config: any
) {
  const { tagFilterValid, simpleMode, alertConfigWithFormModel } = config;
  const selectedMetricGroup = useObservable(selectedMetricGroup$, []) as SelectedMetric;
  const thresholdResult = useObservable(
    ([tagFilterValid, _, selectedMetricGroup]) => {
      return resolveThresholdRequest(alertConfigWithFormModel, tagFilterValid, selectedMetricGroup);
    },
    [tagFilterValid, form, selectedMetricGroup]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    setThresholdResult(thresholdResult);
    const { data, errors } = thresholdResult;

    if (tagFilterValid) {
      updateMultiThresholdInForm(
        createThresholdForm,
        form,
        updateForm,
        data as { type: string; value?: number; baseline?: number[] },
        errors,
        simpleMode,
        editMode
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);

  // This would normally be handled in useSmartAlertFormSideEffects, but since selectedMetricGroup
  // is not part of the form state, we need to handle it here.
  useEffect(() => {
    setThresholdResult(null);
    if (selectedMetricGroup) {
      updateForm(
        form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(true))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMetricGroup, setThresholdResult]);
}

function shouldSkipFetchingThresholdSuggestion(
  isValid: boolean,
  alertConfigWithFormModel: LogSmartAlertConfigWithMetadata & {
    hiddenFields: { calculateThresholdOnBackend: boolean };
  }
): boolean {
  const { hiddenFields, groupBy, threshold } = alertConfigWithFormModel as typeof alertConfigWithFormModel & {
    threshold: { warningThreshold: { type: string } };
  };

  const { calculateThresholdOnBackend } = hiddenFields;
  const { warningThreshold } = threshold;

  if (warningThreshold.type === STATIC_THRESHOLD && groupBy) {
    return true;
  }

  return !isValid || !calculateThresholdOnBackend;
}

type ThresholdConfigWithSmoothingOverrides = ThresholdConfigUnion & {
  seasonality?: Seasonality;
  adaptability?: number;
};

function resolveThresholdRequest(
  alertConfigWithFormModel: LogSmartAlertConfigWithMetadata & {
    hiddenFields: { calculateThresholdOnBackend: boolean };
    threshold: {
      warningThreshold?: ThresholdConfigWithSmoothingOverrides;
      criticalThreshold?: ThresholdConfigWithSmoothingOverrides;
    };
  },
  isValid: boolean,
  selectedMetricGroup: SelectedMetric
): Observable<Result<ThresholdSuggestionResponse>> {
  let { threshold, granularity, tagFilterExpression } = alertConfigWithFormModel;
  const operator = threshold.operator;
  const type =
    alertConfigWithFormModel.threshold.warningThreshold?.type ||
    alertConfigWithFormModel.threshold.criticalThreshold?.type;

  if (shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel)) {
    return empty;
  }

  tagFilterExpression = toBackendQueryModel(tagFilterExpression as any);

  const enrichedTagFilterExpression = selectedMetricGroup
    ? getExpressionWithLogsGroupingTags(tagFilterExpression as TagFilterExpression, [selectedMetricGroup])
    : tagFilterExpression;

  const seasonality = threshold.warningThreshold?.seasonality ?? threshold.criticalThreshold?.seasonality;
  const adaptability = threshold.warningThreshold?.adaptability ?? threshold.criticalThreshold?.adaptability;

  return getLogMetricsThresholdSuggestion({
    tagFilterExpression: enrichedTagFilterExpression,
    metric: {
      metric: metricName,
      granularity,
      aggregation: 'SUM'
    },
    operator,
    fallbackOnError: true,
    seasonality,
    adaptability: adaptability ?? 1,
    type: type!
  });
}
