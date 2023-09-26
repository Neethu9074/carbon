/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import SliSummarySkeleton from 'in-service-levels/components/SloChart/SloChartSummary/SloChartSummarySkeleton';
import { CustomBlueprintType } from 'in-service-levels/components/ConfigDialog/createSloForm';
import SloTimeTile from 'in-service-levels/components/SloChart/SloChartTiles/SloTimeTile';
import { SloEntityType, ServiceLevelIndicatorType, TimeWindowType } from 'in-types';
import SloTile from 'in-service-levels/components/SloChart/SloChartTiles/SloTile';
import useSloFormatter from 'in-service-levels/hooks/useSloFormatter';
import { formatSloStatus } from 'in-service-levels/utils/format';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

import locals from './SloChartSummary.mless';

interface SloChartSummaryProps {
  blueprintType?: CustomBlueprintType;
  budgetSingleNumber?: number;
  consumedBudgetSingleNumber?: number;
  fromTimestamp: number;
  indicatorType?: ServiceLevelIndicatorType;
  metricRemaining?: number;
  metricSli?: number;
  objectiveDuration: number;
  objectiveDurationUnit: string;
  statusSingleNumber?: number;
  sloEntityType?: SloEntityType;
  status?: FetchStatus;
  target?: number;
  timeWindowType: TimeWindowType;
}

function SloChartSummary({
  blueprintType,
  budgetSingleNumber,
  consumedBudgetSingleNumber,
  fromTimestamp,
  indicatorType,
  metricRemaining,
  metricSli,
  objectiveDuration,
  objectiveDurationUnit,
  sloEntityType,
  status,
  statusSingleNumber,
  target,
  timeWindowType
}: SloChartSummaryProps) {
  const isCompact = !useMediaQuery('(min-width: 1300px)');
  const sliFormatter = useSloFormatter({ blueprintType, indicatorType, sloEntityType });

  if (status === 'pending') return <SliSummarySkeleton compact={isCompact} />;

  const sloSpent =
    target !== null && target !== undefined && metricSli !== null && metricSli !== undefined && metricSli < target;
  const budgetSpent = metricRemaining !== null && metricRemaining !== undefined && metricRemaining <= 0;

  const { sloStatus, sloTarget } = formatSloStatus({ status: statusSingleNumber, target });

  return (
    <div className={isCompact ? locals.listContainer : locals.tilesContainer}>
      <SloTile
        title={t('in-service-levels:sloChart.sloChartSummary.status')}
        value={sloStatus}
        budgetTitle={t('in-service-levels:sloChart.sloChartSummary.target')}
        budget={sloTarget}
        budgetSpent={sloSpent}
        compact={isCompact}
      />
      <SloTile
        title={t('in-service-levels:sloChart.sloChartSummary.errorBudgetSpent')}
        value={consumedBudgetSingleNumber !== undefined ? sliFormatter(consumedBudgetSingleNumber) : undefined}
        budgetTitle={t('in-service-levels:sloChart.sloChartSummary.errorBudget')}
        budget={budgetSingleNumber !== undefined ? sliFormatter(budgetSingleNumber) : undefined}
        budgetSpent={budgetSpent}
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
