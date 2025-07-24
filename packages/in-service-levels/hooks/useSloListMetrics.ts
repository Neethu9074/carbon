/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useState } from 'react';

import type { MetricResult, Result, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { combineLatest, timeout } from '@instana/observables';
import type { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { error, isLoading, mapData } from 'in-services/util/result';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import { sloMetrics } from 'in-service-levels/metrics';
import { hours } from 'in-services/time/time';

const timeConfig: TimeConfig = { autoRefresh: false, windowSize: hours.toMillis(1) };
const MAX_RETRIES = 3;

// TODO: Handle error case and max timeout error case

export function useSloStatusMetrics(configuration: ServiceLevelObjectiveConfiguration) {
  // For slo list make sure we always fetch the latest metrics(for past hour)
  const [retries, setRetries] = useState(0);
  const result =
    useObservable<Result<MetricResult[]>, [string, number]>(
      () =>
        withTimeout(
          getUnifiedMetrics({
            metrics: {
              status: sloMetrics.status.singleNumber({
                configId: configuration.id!,
                timeConfig
              })
            }
          }),
          45000,
          () => {
            if (retries < MAX_RETRIES) setRetries(retries => retries + 1);
          },
          retries
        ),

      [configuration.id!, retries]
    ) ?? (pendingResult as Result<MetricResult[]>);
  const status = mapData(result, ([metric]) => metric);
  return resultToFetchedStateResponse(status);
}

export function useSloErrorBudgetMetrics(configuration: ServiceLevelObjectiveConfiguration) {
  // For slo list make sure we always fetch the latest metrics(for past hour)
  const [retries, setRetries] = useState(0);
  const result =
    useObservable<Result<MetricResult[]>, [string, number]>(
      () =>
        withTimeout(
          getUnifiedMetrics({
            metrics: {
              remainingBudget: sloMetrics.remainingBudget.singleNumber({
                configId: configuration.id!,
                timeConfig
              }),
              remainingBudgetSpark: sloMetrics.remainingBudget.timeSeriesCompact({
                configId: configuration.id!,
                timeConfig: timeConfig
              })
            }
          }),
          45000,
          () => {
            if (retries < MAX_RETRIES) setRetries(retries => retries + 1);
          },
          retries
        ),

      [configuration.id!, retries]
    ) ?? (pendingResult as Result<MetricResult[]>);
  const mappedResult = mapData(result, data => {
    const remainingBudget = data.find(res => res.id === 'remainingBudget')!;
    const remainingBudgetSpark = data.find(res => res.id === 'remainingBudgetSpark')!;
    return {
      remainingBudgetSpark,
      remainingBudget
    };
  });
  return resultToFetchedStateResponse(mappedResult);
}

function withTimeout<T>(observable: Observable<Result<T>>, millis: number, onTimeout: () => void, retries: number) {
  const timeoutSignal = 'signal';

  return combineLatest([
    observable.startWith(pendingResult),
    timeout(millis)
      .map(() => timeoutSignal)
      .startWith(null)
  ])
    .map(([observable, signal]) => {
      if (isLoading(observable) && signal === timeoutSignal) {
        onTimeout();
        return retries < MAX_RETRIES
          ? pendingResult
          : error([{ code: 'TIMEOUT', message: 'Timed out fetching metrics' }]);
      }
      return observable;
    })
    .distinct();
}
