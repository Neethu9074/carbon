/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloEntityType, ServiceLevelIndicatorType, TimeWindowType } from '@instana/types';

import SliSummarySkeleton from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummarySkeleton';
import { formatSloStatus, getValueFromSingleValueMetric } from 'in-service-levels/utils/format';
import SloTimeTile from 'in-service-levels/components/SloChart/SloChartTiles/SloTimeTile';
import SloTile from 'in-service-levels/components/SloChart/SloChartTiles/SloTile';
import useSloFormatter from 'in-service-levels/hooks/useSloFormatter';
import { MetricDataPoint } from 'in-components/Chart/types';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from './SloChartSummary.mless';

interface SloChartSummaryProps {
  remainingBudget?: MetricDataPoint[];
  totalBudget?: MetricDataPoint[];
  fromTimestamp: number;
  indicatorType?: ServiceLevelIndicatorType;
  metricRemaining?: number;
  metricSli?: number;
  objectiveDuration: number;
  objectiveDurationUnit: string;
  sloStatus?: MetricDataPoint[];
  sloEntityType?: SloEntityType;
  status?: FetchStatus;
  target?: number;
  timeWindowType: TimeWindowType;
}

function SloChartSummary({
  remainingBudget,
  totalBudget,
  fromTimestamp,
  indicatorType,
  metricRemaining,
  metricSli,
  objectiveDuration,
  objectiveDurationUnit,
  sloEntityType,
  status,
  sloStatus,
  target,
  timeWindowType
}: SloChartSummaryProps) {
  const isCompact = !useMediaQuery('(min-width: 1300px)');
  const sliFormatter = useSloFormatter({ indicatorType, sloEntityType });

  const totalBudgetValue = getValueFromSingleValueMetric(totalBudget);
  const remainingBudgetValue = getValueFromSingleValueMetric(remainingBudget);
  const sloStatusValue = getValueFromSingleValueMetric(sloStatus);

  if (status === 'pending') return <SliSummarySkeleton compact={isCompact} />;

  const sloSpent =
    target !== null && target !== undefined && metricSli !== null && metricSli !== undefined && metricSli < target;
  const budgetSpent = metricRemaining !== null && metricRemaining !== undefined && metricRemaining <= 0;

  const { sloStatus: formattedSloStatus, sloTarget } = formatSloStatus({
    status: sloStatusValue,
    target
  });

  return (
    <div className={isCompact ? locals.listContainer : locals.tilesContainer}>
      <SloTile
        title={t('in-service-levels:sloChart.sloChartSummary.status')}
        value={formattedSloStatus}
        companionTitle={t('in-service-levels:sloChart.sloChartSummary.target')}
        companionValue={sloTarget}
        spent={sloSpent}
        compact={isCompact}
      />
      <SloTile
        title={t('in-service-levels:sloChart.sloChartSummary.errorBudgetRemaining')}
        value={remainingBudgetValue !== undefined ? sliFormatter(remainingBudgetValue) : undefined}
        companionTitle={t('in-service-levels:sloChart.sloChartSummary.errorBudgetTotal')}
        companionValue={totalBudgetValue !== undefined ? sliFormatter(totalBudgetValue) : undefined}
        spent={budgetSpent}
        compact={isCompact}
      />
      <SloTimeTile
        compact={isCompact}
        objectiveDuration={objectiveDuration}
        objectiveDurationUnit={objectiveDurationUnit}
        title={t('in-service-levels:sloChart.sloChartSummary.timeWindow')}
        timeFrameLabel={t('in-service-levels:sloChart.sloChartSummary.timeWindowType', {
          context: timeWindowType
        })}
        fromTimestamp={fromTimestamp}
      />
    </div>
  );
}

export default SloChartSummary;
