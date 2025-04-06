/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo } from 'react';

import { MetricResult, Result } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { formToSloConfiguration } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { sloPreviewMetrics } from 'in-service-levels/metrics';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useSloPreviewMetrics(form: SloForm): FetchedState<MetricResult[]> {
  const timeConfig = useTimeConfig();
  const { nameTags: _nameTags, ...formWithoutNameFields } = form.toJS();

  // we don't want to refetch on name / tags fields changes as they don't
  // really change the widget, but are a part of the config that is passed to the BE
  const configToPassToApi = useMemo(() => {
    return formToSloConfiguration(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(formWithoutNameFields)]);

  const remainingBudgetMetrics = sloPreviewMetrics.remainingBudget.timeSeries({
    config: configToPassToApi,
    timeConfig
  });

  const remainingBudgetSingleNumberMetrics = sloPreviewMetrics.remainingBudget.singleNumber({
    config: configToPassToApi,
    timeConfig
  });

  const statusMetrics = sloPreviewMetrics.status.singleNumber({
    config: configToPassToApi,
    timeConfig
  });

  const totalBudgetSingleNumberMetrics = sloPreviewMetrics.totalBudget.singleNumber({
    config: configToPassToApi,
    timeConfig
  });

  const metrics = {
    totalBudget: totalBudgetSingleNumberMetrics,
    errorBudgetRemaining: remainingBudgetMetrics,
    remainingBudgetNumber: remainingBudgetSingleNumberMetrics,
    statusMetric: statusMetrics
  };

  const result: Result<MetricResult[]> =
    useObservable(() => {
      return getUnifiedMetrics({
        metrics
      });
    }, [generateStableHash(metrics)]) ?? pendingResult;
  return resultToFetchedStateResponse(result);
}
