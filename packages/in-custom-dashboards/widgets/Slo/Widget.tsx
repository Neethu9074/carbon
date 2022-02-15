/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import moment from 'moment';

import { Message, Card } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  sloTarget,
  sliConfigId,
  timeWindowType,
  timeWindowDuration,
  timeWindowDurationUnit,
  timeWindowStart,
  parsedTimestamp,
  ensureConfigBackwardCompatibility,
  entityId,
  entityType,
  SloWidgetConfiguration,
  TimeWindowDuration
} from 'in-custom-dashboards/widgets/Slo/form';
import {
  AggregationType,
  MetricResult,
  MetricSource,
  Result,
  ResultType,
  SliConfigurationWithLastUpdated,
  TimeConfig,
  TimeShift,
  UnifiedMetricConfiguration
} from 'in-types';
import getUnifiedSloMetrics from 'in-custom-dashboards/widgets/Slo/subscriptions/getUnifiedSloMetrics';
import useSliConfiguration from 'in-custom-dashboards/widgets/Slo/hooks/useSliConfiguration';
import { MetricDataSeries } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import WidgetLeftHeader from 'in-custom-dashboards/widgets/Slo/WidgetLeftHeader';
import useSloEntity from 'in-custom-dashboards/widgets/Slo/hooks/useSloEntity';
import { WidgetHeader } from 'in-custom-dashboards/widgets/Slo/WidgetHeader';
import Chart from 'in-custom-dashboards/widgets/Slo/Chart';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './Widget.mless';

const oneMinute = 60 * 1000;
const oneHour = 60 * oneMinute;
const oneDay = 24 * oneHour;
const oneWeekTimeConfig = {
  windowSize: 7 * oneDay,
  autoRefresh: false
};

interface WidgetProps {
  actions: React.ReactNode;
  config: SloWidgetConfiguration;
  isPreview?: boolean;
  title: string;
  dragHandle: React.ReactNode;
}

export default function Widget({ actions, config, isPreview, title, dragHandle }: WidgetProps) {
  const compatibleConfig = ensureConfigBackwardCompatibility(config);
  const entityIdValue = compatibleConfig[entityId];
  const entityTypeValue = compatibleConfig[entityType];

  const slo = compatibleConfig[sloTarget] ?? '';
  const sliConfigIdValue = compatibleConfig[sliConfigId];
  const timeWindowTypeValue = compatibleConfig[timeWindowType] ?? 'dynamic';
  const isDynamic = timeWindowTypeValue === 'dynamic';
  const isRolling = timeWindowTypeValue === 'rolling';
  const isFixed = timeWindowTypeValue === 'fixed';
  const timeWindowDurationValue = compatibleConfig[timeWindowDuration] ?? 1;
  const timeWindowDurationUnitValue = compatibleConfig[timeWindowDurationUnit] ?? 'weeks';
  const timeWindowStartDate = compatibleConfig[timeWindowStart]?.date;
  const timeWindowStartTime = compatibleConfig[timeWindowStart]?.time;

  const { timeWindowConfig, fromTimestamp, toTimestamp } = useWidgetTimeConfig({
    isPreview,
    isRolling,
    isFixed,
    timeWindowDurationValue,
    timeWindowDurationUnitValue,
    timeWindowStartDate,
    timeWindowStartTime
  });

  const granularity = getGranularity(timeWindowConfig);

  const [sliConfiguration, sliConfigurationStatus] = useSliConfiguration(sliConfigIdValue);
  const [entity] = useSloEntity({ entityId: entityIdValue, entityType: entityTypeValue });

  const sloMetricsResult = useSloMetrics({ slo, sliId: sliConfigIdValue, timeWindowConfig, granularity });

  const sloMetrics = sloMetricsResult?.data;

  const budget = getMetricValue(findMetric('budget', sloMetrics));

  return (
    <Card
      bodyClassName={locals.bodyNoPadding}
      rightHeaderContent={
        <>
          {dragHandle}
          {actions}
        </>
      }
      title={title}
      headerClassName={locals.title}
      leftHeaderContent={
        sliConfigurationStatus !== 'rejected' ? (
          <WidgetLeftHeader
            monitoredEntityType={entityTypeValue}
            monitoredEntity={entity}
            sliConfig={sliConfiguration}
          />
        ) : (
          undefined
        )
      }
    >
      <WidgetHeader
        slo={slo}
        budget={budget}
        isDynamic={isDynamic}
        isRolling={isRolling}
        fromTimestamp={fromTimestamp}
        toTimestamp={toTimestamp}
        sliEntity={sliConfiguration?.sliEntity}
        metricSpent={getMetricValue(findMetric('spent', sloMetrics))}
        metricSli={getMetricValue(findMetric('sli', sloMetrics))}
        metricRemaining={getMetricValue(findMetric('remaining', sloMetrics))}
      />
      <div className={locals.chart}>
        <WidgetContent
          sloMetricsResult={sloMetricsResult}
          sliConfigIdValue={sliConfigIdValue}
          timeConfig={timeWindowConfig}
          granularity={granularity}
          budget={budget}
          sliConfig={sliConfiguration}
          isPreview={isPreview}
          disableZooming={isFixed || isRolling}
        />
      </div>
    </Card>
  );
}

const findMetric = (metricName: string, sloMetrics: MetricResult[] = []): MetricDataSeries => {
  const metric = sloMetrics?.find(({ id }) => id === metricName);
  return (metric?.values ?? []) as MetricDataSeries;
};

const getMetricValue = (metric: MetricDataSeries = []): number => {
  return metric[0]?.[1];
};

function calculateTimeWindowConfig(
  timeConfig: TimeConfig,
  isRolling: boolean | undefined,
  isFixed: boolean | undefined,
  timeWindowDurationValue: number,
  timeWindowDurationUnitValue: TimeWindowDuration,
  timeWindowStartDate: string | undefined,
  timeWindowStartTime: string | undefined
) {
  const timeWindowConfig = { ...timeConfig };

  let fromTimestamp = (timeConfig.to ?? new Date().getTime()) - timeConfig.windowSize;
  let toTimestamp = timeConfig.to ?? fromTimestamp + timeConfig.windowSize;

  if (isRolling) {
    fromTimestamp = moment(toTimestamp)
      .subtract(timeWindowDurationValue, timeWindowDurationUnitValue)
      .valueOf();
    timeWindowConfig.windowSize = toTimestamp - fromTimestamp;
  }

  if (isFixed) {
    let timeWindowStartTimeStamp = parsedTimestamp(timeWindowStartDate + '  ' + timeWindowStartTime);
    if (timeWindowStartTimeStamp) {
      let now = moment();
      let nextStart = moment(timeWindowStartTimeStamp);
      let latestIntervalStart;
      do {
        latestIntervalStart = nextStart;
        nextStart = latestIntervalStart.clone().add(timeWindowDurationValue, timeWindowDurationUnitValue);
      } while (nextStart.isBefore(now));

      fromTimestamp = latestIntervalStart.valueOf();
      toTimestamp = nextStart.valueOf();
      timeWindowConfig.windowSize = nextStart.valueOf() - fromTimestamp;
    }
  }
  if (!timeConfig.autoRefresh) {
    timeWindowConfig.to = toTimestamp;
    timeWindowConfig.focusedMoment = toTimestamp;
  }
  return { timeWindowConfig, fromTimestamp, toTimestamp };
}

const filterAvailableData = (dataSeries: MetricDataSeries): MetricDataSeries => {
  if (!dataSeries) {
    return [];
  }
  // when no data for a specific metric was returned
  if (dataSeries.length === 1) {
    if (dataSeries[0][0] == null) {
      return [];
    }
  }
  // Filtering-out the values with timestamps in future
  // This should be done on the backend normally, but it was not specified, hence it was
  // implemented on the client in time.
  const now = new Date().getTime();
  return dataSeries.filter(([ts]) => ts <= now);
};

function getGranularity(timeConfig: TimeConfig): number {
  const now = Date.now();
  const toOrNow = timeConfig.to ?? now;
  const from = toOrNow - timeConfig.windowSize;

  if (timeConfig.windowSize < oneDay && from > now - oneDay) {
    // if timeframe is within the last 24 hours, and window-size less than a day, then request metric in
    // one minute granularity. We do not want to query CH with oneMinute granularity with large windowSize as
    // this would lead to performance problems.
    return oneMinute;
  }
  return oneHour;
}

interface MetricBaseConfig {
  sliConfigId: string;
  timeShift: TimeShift;
  slo: number;
  aggregation: AggregationType;
  source: MetricSource;
  timeConfig: TimeConfig;
  resultType: ResultType;
}

interface UnifiedMetricConfigurations {
  [index: string]: UnifiedMetricConfiguration;
}

const getMetrics = (metricBaseConfig: MetricBaseConfig, granularity: number): UnifiedMetricConfigurations => {
  return {
    consumed: {
      ...metricBaseConfig,
      metric: 'CONSUMED_ERROR_BUDGET_CHART',
      granularity
    },
    sli: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'SLI'
    },
    spent: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'ERROR_BUDGET_SPENT'
    },
    remaining: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'ERROR_BUDGET_REMAINING'
    },
    budget: {
      ...metricBaseConfig,
      resultType: 'SINGLE_NUMBER',
      metric: 'TOTAL_ERROR_BUDGET'
    },
    hourlyBudget: {
      ...metricBaseConfig,
      metric: 'HOURLY_ERROR_BUDGET_CHART',
      granularity
    }
  };
};

const isConfiguredSliDeleted = (sloMetricsResult: Result<MetricResult[]>, sliConfigIdValue: string): boolean => {
  return (
    hasError(sloMetricsResult) &&
    sloMetricsResult.errors.some(
      ({ message }) => message === `The SliConfiguration for the id ${sliConfigIdValue} does not exist`
    )
  );
};

interface WidgetContentProps {
  sloMetricsResult: Result<MetricResult[]>;
  sliConfigIdValue: string;
  timeConfig: TimeConfig;
  granularity: number;
  budget: number;
  sliConfig?: SliConfigurationWithLastUpdated;
  isPreview?: boolean;
  disableZooming?: boolean;
}

const WidgetContent = ({ sloMetricsResult, sliConfigIdValue, ...otherChartProps }: WidgetContentProps) => {
  if (isConfiguredSliDeleted(sloMetricsResult, sliConfigIdValue)) {
    return (
      <Message
        type="error"
        withIcon
        title={t('in-custom-dashboards:widgets.chart.errorTitleForConfiguredSliDeletion')}
        description={t('in-custom-dashboards:widgets.chart.errorDescriptionToConfigureOtherSLI')}
      />
    );
  }

  return (
    <Chart
      result={sloMetricsResult}
      consumed={filterAvailableData(findMetric('consumed', sloMetricsResult?.data))}
      hourlyBudget={filterAvailableData(findMetric('hourlyBudget', sloMetricsResult?.data))}
      {...otherChartProps}
    />
  );
};

interface UseWidgetTimeConfigProps {
  isPreview?: boolean;
  isRolling?: boolean;
  isFixed?: boolean;
  timeWindowDurationValue: number;
  timeWindowDurationUnitValue: TimeWindowDuration;
  timeWindowStartDate?: string;
  timeWindowStartTime?: string;
}

function useWidgetTimeConfig({
  isPreview,
  isRolling,
  isFixed,
  timeWindowDurationValue,
  timeWindowDurationUnitValue,
  timeWindowStartDate,
  timeWindowStartTime
}: UseWidgetTimeConfigProps) {
  const currentProductTimeConfig = useTimeConfig();
  const timeConfig = isPreview ? oneWeekTimeConfig : currentProductTimeConfig;
  return useMemo(
    () =>
      calculateTimeWindowConfig(
        timeConfig,
        isRolling,
        isFixed,
        timeWindowDurationValue,
        timeWindowDurationUnitValue,
        timeWindowStartDate,
        timeWindowStartTime
      ),
    [
      timeConfig,
      isRolling,
      isFixed,
      timeWindowDurationValue,
      timeWindowDurationUnitValue,
      timeWindowStartDate,
      timeWindowStartTime
    ]
  );
}

interface UseSloMetricsProps {
  slo: number;
  sliId: string;
  timeWindowConfig: TimeConfig;
  granularity: number;
}

function useSloMetrics({ slo, sliId, timeWindowConfig, granularity }: UseSloMetricsProps): Result<MetricResult[]> {
  const metrics = useMemo(() => {
    const metricConfig: MetricBaseConfig = {
      sliConfigId: sliId,
      timeShift: { offset: 0 },
      slo,
      aggregation: 'MEAN', // a value must be sent to the backend - it has no meaning at all
      source: 'SLI',
      timeConfig: timeWindowConfig,
      resultType: 'TIME_SERIES'
    };
    return getMetrics(metricConfig, granularity);
  }, [slo, sliId, timeWindowConfig, granularity]);

  return useObservable(() => getUnifiedSloMetrics({ metrics }), [metrics]) ?? pendingResult;
}
