/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import { useEffect } from 'react';

import {
  Result,
  ThresholdConfigUnion,
  Seasonality,
  ThresholdSuggestionResponse,
  AdaptiveBaselineSuggestionResponse
} from '@instana/types';
//@ts-ignore
import { Observable, empty } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getInfraMetricsThresholdSuggestion from 'in-alerting/smart-alerts/infrastructure/subscriptions/getInfraMetricsThresholdSuggestion';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { useSelectedMetricGroup } from 'in-alerting/smart-alerts/infrastructure/providers/SelectedMetricGroupProvider';
import { getEnrichedTagFilterExpression } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { updateMultiThresholdInForm } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import createThresholdForm from 'in-alerting/smart-alerts/infrastructure/form/thresholdForm';

// Remove thresholds with "Infinity" values to avoid chart rendering issues.
// TODO: Remove this once the backend is fixed.
const filterOutThresholdResultInfinityValues = (thresholdResult: Result<ThresholdSuggestionResponse>) => {
  if (!Array.isArray((thresholdResult as Result<AdaptiveBaselineSuggestionResponse>)?.data?.baseline)) {
    return thresholdResult;
  }

  const filteredBaseline = (thresholdResult as Result<AdaptiveBaselineSuggestionResponse>).data?.baseline.filter(
    ([_timestamp, baseline, bound]) => Number.isFinite(baseline) && Number.isFinite(bound)
  );

  return {
    ...thresholdResult,
    data: {
      ...thresholdResult.data,
      baseline: filteredBaseline
    }
  };
};

export default function useThresholdSuggestion(
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  setThresholdResult: React.Dispatch<React.SetStateAction<Result<ThresholdSuggestionResponse> | any>>,
  editMode: boolean,
  config: any
) {
  const { isValid, simpleMode, alertConfigWithFormModel } = config;
  const { selectedMetricGroup } = useSelectedMetricGroup();
  const thresholdResult = useObservable(
    ([isValid, _, selectedMetricGroup]) => {
      return resolveThresholdRequest(alertConfigWithFormModel, isValid, selectedMetricGroup);
    },
    [isValid, form, selectedMetricGroup]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    const patchedThresholdResult = filterOutThresholdResultInfinityValues(thresholdResult);

    setThresholdResult(patchedThresholdResult);
    const { data, errors } = patchedThresholdResult;

    if (isValid) {
      updateMultiThresholdInForm(
        createThresholdForm,
        form,
        updateForm,
        data as { type: string; value?: any; baseline?: number[] },
        errors,
        simpleMode,
        editMode
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);

  // This would normally be handled in useInfraSmartAlertFormSideEffects, but since selectedMetricGroup
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
  alertConfigWithFormModel: InfraSmartAlertConfigWithMetadata & {
    hiddenFields: { calculateThresholdOnBackend: boolean };
  }
) {
  const {
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;
  return !isValid || !calculateThresholdOnBackend;
}

type ThresholdConfigWithSmoothingOverrides = ThresholdConfigUnion & {
  seasonality?: Seasonality;
  adaptability?: number;
};

function resolveThresholdRequest(
  alertConfigWithFormModel: InfraSmartAlertConfigWithMetadata & {
    hiddenFields: { calculateThresholdOnBackend: boolean };
    threshold: {
      warningThreshold?: ThresholdConfigWithSmoothingOverrides;
      criticalThreshold?: ThresholdConfigWithSmoothingOverrides;
    };
  },
  isValid: boolean,
  selectedMetricGroup: Tags | null
): Observable<Result<ThresholdSuggestionResponse>> {
  const {
    rule: { metricName, aggregation, entityType, crossSeriesAggregation, regex },
    threshold,
    granularity,
    tagFilterExpression
  } = alertConfigWithFormModel;

  const operator = threshold.operator;
  const type =
    alertConfigWithFormModel.threshold.warningThreshold?.type ||
    alertConfigWithFormModel.threshold.criticalThreshold?.type;

  if (shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel) || !metricName) {
    return empty;
  }

  const enrichedTagFilterExpression = getEnrichedTagFilterExpression(tagFilterExpression, selectedMetricGroup);

  const seasonality = threshold.warningThreshold?.seasonality ?? threshold.criticalThreshold?.seasonality;
  const adaptability = threshold.warningThreshold?.adaptability ?? threshold.criticalThreshold?.adaptability;

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
    seasonality,
    adaptability: adaptability ?? 1,
    type: type!
  });
}
