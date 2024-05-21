/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import getTagSuggestions from 'in-applications/subscriptions/getTagSuggestions';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { pendingResult } from 'in-services/fixedObjects';
import { success } from 'in-services/util/result';

export function useCustomMetricSuggestions(
  supportedCustomMetrics: string[],
  timeConfig: TimeConfig,
  formModel: FormModelElement[]
) {
  const tagFilterExpression = toBackendQueryModel(formModel) ?? EMPTY_EXPRESSION;
  const results = useObservable(
    () =>
      supportedCustomMetrics
        ? combineLatest(
            supportedCustomMetrics.map(tagName =>
              getTagSuggestions({
                entity: NOT_APPLICABLE,
                tagFilterExpression,
                tagName,
                filter: {
                  timeConfig,
                  includeInternalCalls: false,
                  includeSyntheticCalls: false,
                  useLongTermDataOnly: false
                },
                requestingSecondaryKeySuggestions: false
              }).map(result => {
                return result.data ? { ...result, data: { metricId: tagName, ...result.data } } : pendingResult;
              })
            )
          )
        : just([]),
    [timeConfig, formModel, supportedCustomMetrics]
  ) ?? [pendingResult];

  return results.reduce((prev, current) => {
    const prevData = prev.data ?? [];
    const currentData = current.data;
    const data = currentData ? [...prevData, currentData] : prevData;

    return {
      data,
      progress: { loading: prev.progress.loading && current.progress.loading },
      errors: [...prev.errors, ...current.errors]
    };
  }, success([]));
}
