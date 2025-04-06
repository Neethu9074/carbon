/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { MetricResult, Result, TimeConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import { sloMetrics } from 'in-service-levels/metrics';
import { FetchedState } from 'in-hooks/utils/types';

export default function useSloWidgetMetrics(
  sloConfig: ServiceLevelObjectiveConfiguration,
  timeConfig: TimeConfig
): FetchedState<MetricResult[]> {
  const remainingBudgetSingleNumberMetrics = sloMetrics.remainingBudget.singleNumber({
    configId: sloConfig.id!,
    timeConfig
  });

  const statusMetrics = sloMetrics.status.singleNumber({
    configId: sloConfig.id!,
    timeConfig
  });

  const totalBudegtSingleNumberMetrics = sloMetrics.totalBudget.singleNumber({ timeConfig, configId: sloConfig.id! });

  const metrics = {
    remainingBudget: remainingBudgetSingleNumberMetrics,
    sloStatus: statusMetrics,
    totalBudget: totalBudegtSingleNumberMetrics
  };

  const result: Result<MetricResult[]> =
    useObservable(() => {
      return getUnifiedMetrics({
        metrics
      });
    }, [generateStableHash(metrics)]) ?? pendingResult;
  return resultToFetchedStateResponse(result);
}
