/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import { useEffect } from 'react';

//@ts-ignore
import { Observable, empty } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getInfraMetricsThresholdSuggestion from 'in-alerting/smart-alerts/infrastructure/subscriptions/getInfraMetricsThresholdSuggestion';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getEnrichedTagFilterExpression } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import { Result, ThresholdType, StaticThresholdSuggestionResponse, ThresholdSuggestionResponse } from 'in-types';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function useThresholdSuggestion(
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  setThresholdResult: React.Dispatch<React.SetStateAction<Result<ThresholdSuggestionResponse> | any>>,
  editMode: boolean | undefined,
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
    const data = thresholdResult?.data as StaticThresholdSuggestionResponse;

    if (isValid) {
      // @ts-ignore
      let updatedForm: MapForm<any> = form
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(false))
        // @ts-expect-error ts has problems with nested fields on MapForm<any>
        .updateIn(['hiddenFields', 'suggestedThresholdValue'], (f: Field<number>) => f.setValue(data?.value));

      const warningThresholdForm = form.get('threshold')?.get('warningThreshold');

      if (shouldAddNewThresholdData(editMode, warningThresholdForm)) {
        // @ts-ignore
        updatedForm = updatedForm?.updateIn(['threshold', 'warningThreshold'], (thresholdMapForm: MapForm<any>) =>
          thresholdMapForm.updateIn(['value'], item =>
            (item as Field<any>)
              .setValue(data?.value)
              .setTouched((warningThresholdForm.get('value') as Field<string>).touched)
          )
        );
      }

      updateForm(updatedForm);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}

function shouldAddNewThresholdData(editMode: boolean | undefined, warningThresholdForm: MapForm<any>): boolean {
  if (editMode) {
    return false;
  }

  const type = (warningThresholdForm?.get('type') as Field<ThresholdType>)?.value;

  if (type === STATIC_THRESHOLD) {
    return !warningThresholdForm?.get('value')?.touched;
  }

  return false;
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
): Observable<Result<ThresholdSuggestionResponse>> {
  const {
    rule: { metricName, aggregation, entityType, crossSeriesAggregation, regex },
    threshold: { operator, type },
    granularity,
    tagFilterExpression,
    groupBy
  } = alertConfigWithFormModel;

  if (shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel) || groupBy?.length > 0) {
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
    adaptability: 1,
    type
  });
}
