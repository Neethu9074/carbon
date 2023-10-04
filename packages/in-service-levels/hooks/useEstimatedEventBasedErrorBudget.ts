/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { daysInWeek } from 'date-fns';

import {
  ApplicationSloEntity,
  GetUnifiedMetricsQuery,
  Result,
  SloEntity,
  TagFilterExpressionElementUnion,
  TimeConfig,
  TimeWindow,
  WebsiteSloEntity,
  isApplicationSloEntity
} from '@instana/types';
import { useObservable } from '@instana/hooks';

import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { days } from 'in-services/time/time';

interface UseEstimatedEventBasedErrorBudgetProps {
  entity: ApplicationSloEntity | WebsiteSloEntity;
  timeWindow: TimeWindow;
  target?: number;
}

export default function useEstimatedEventBasedErrorBudget({
  entity,
  timeWindow,
  target
}: UseEstimatedEventBasedErrorBudgetProps): FetchedState<number | undefined> {
  const timeConfig = getTimeConfigFromTimeWindow(timeWindow);
  const tagFilterExpression = useBasicTagFilterExpression({ entity });

  const result: Result<number | undefined> =
    useObservable(() => {
      if (target === undefined) return;

      const isApplication = isApplicationSloEntity(entity);
      const metricsQuery = isApplication
        ? getApplicationMetricsQuery({ entity, timeConfig, tagFilterExpression })
        : getWebsiteMetricsQuery({ entity, timeConfig, tagFilterExpression });

      return getUnifiedMetrics(metricsQuery).map(getBudgetFromMetricsResult(target, timeWindow));
    }, [entity]) ?? pendingResult;

  return resultToFetchedStateResponse(result);
}

function getTimeConfigFromTimeWindow(timeWindow: TimeWindow): TimeConfig {
  const durationInDays = getDurationInDaysClamped(timeWindow);
  const windowSize = days.toMillis(durationInDays);
  const to = Date.now();
  const focusedMoment = to;

  return { autoRefresh: false, to, focusedMoment, windowSize };
}

function getDurationInDaysClamped({ duration, durationUnit }: TimeWindow): number {
  if (durationUnit === 'day') return Math.min(daysInWeek, duration);

  return daysInWeek;
}

function isTimeWindowLargerThanOneWeek({ duration, durationUnit }: TimeWindow): boolean {
  if (durationUnit === 'week') return duration > 1;
  if (durationUnit === 'day') return duration > daysInWeek;

  return true;
}

interface ExtrapolateBudgetProps {
  budgetForOneWeek: number;
  timeWindow: TimeWindow;
}

function extrapolateBudget({ budgetForOneWeek, timeWindow }: ExtrapolateBudgetProps): number {
  const { duration, durationUnit } = timeWindow;
  const durationInDays = durationUnit === 'week' ? duration * daysInWeek : duration;
  return (budgetForOneWeek / daysInWeek) * durationInDays;
}

function getBudgetFromMetricsResult(
  target: number,
  timeWindow: TimeWindow
): (result: Result<UnifiedMetricsResult[]>) => Result<number | undefined> {
  return result => {
    const { data } = result;
    const calls = data?.at(0)?.values?.at(0)?.at(1);

    if (!calls) return { ...result, data: undefined };

    const budget = Math.round((1 - target) * calls);
    const extrapolatedBudget = isTimeWindowLargerThanOneWeek(timeWindow)
      ? extrapolateBudget({ budgetForOneWeek: budget, timeWindow })
      : budget;

    return { ...result, data: extrapolatedBudget };
  };
}

interface GetMetricsProps<ENTITY_TYPE extends SloEntity> {
  entity: ENTITY_TYPE;
  tagFilterExpression: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
}

function getApplicationMetricsQuery({
  entity,
  tagFilterExpression,
  timeConfig
}: GetMetricsProps<ApplicationSloEntity>): GetUnifiedMetricsQuery {
  return {
    metrics: {
      calls: applicationMetrics.calls.singleNumber({
        entity,
        timeConfig,
        tagFilterExpression,
        aggregation: 'SUM'
      })
    }
  };
}

function getWebsiteMetricsQuery({
  entity,
  tagFilterExpression,
  timeConfig
}: GetMetricsProps<WebsiteSloEntity>): GetUnifiedMetricsQuery {
  return {
    metrics: {
      beaconCount: websiteMetrics.beaconCount.singleNumber({
        entity,
        tagFilterExpression,
        timeConfig,
        aggregation: 'SUM'
      })
    }
  };
}
