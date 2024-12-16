/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import SliSummarySkeleton from 'in-custom-dashboards/widgets/SloLegacy/components/SliSummary/SliSummarySkeleton';
import SloTimeTile from 'in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTimeTile';
import { useSliFormatter } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliFormatter';
import SloTile from 'in-custom-dashboards/widgets/SloLegacy/components/widget/tiles/SloTile';
import { TimeWindowType } from 'in-custom-dashboards/widgets/SloLegacy/form';
import { formatSloStatus } from 'in-service-levels/utils/format';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { FetchStatus } from 'in-hooks/utils/types';
import { SliEntity } from 'in-types';
import { t } from 'in-i18n';

import locals from './SliSummary.mless';

interface SliSummaryProps {
  status?: FetchStatus;
  slo?: number;
  budget?: number;
  timeWindowType: TimeWindowType;
  fromTimestamp: number;
  toTimestamp: number;
  sliEntity?: SliEntity;
  metricSpent?: number;
  metricSli?: number;
  metricRemaining?: number;
}

function SliSummary({
  status,
  slo,
  budget,
  timeWindowType,
  fromTimestamp,
  toTimestamp,
  sliEntity,
  metricSpent: spent,
  metricSli: sli,
  metricRemaining: remaining
}: SliSummaryProps) {
  const isCompact = !useMediaQuery('(min-width: 1300px)');
  const sliFormatter = useSliFormatter(sliEntity);

  if (status === 'pending') return <SliSummarySkeleton compact={isCompact} />;

  const sloSpent = slo != null && sli != null && sli < slo;
  const budgetSpent = remaining != null && remaining <= 0;

  const { sloStatus, sloTarget } = formatSloStatus({ status: sli, target: slo });

  return (
    <div className={isCompact ? locals.listContainer : locals.tilesContainer}>
      <SloTile
        title={t('in-custom-dashboards:widgets.slo.sliSummary.status')}
        value={sloStatus}
        budgetTitle={t('in-custom-dashboards:widgets.slo.sliSummary.target')}
        budget={sloTarget}
        budgetSpent={sloSpent}
        compact={isCompact}
      />
      <SloTile
        title={t('in-custom-dashboards:widgets.slo.sliSummary.errorBudgetSpent')}
        value={spent !== undefined ? sliFormatter(spent) : undefined}
        budgetTitle={t('in-custom-dashboards:widgets.slo.sliSummary.errorBudget')}
        budget={budget !== undefined ? sliFormatter(budget) : undefined}
        budgetSpent={budgetSpent}
        compact={isCompact}
      />
      <SloTimeTile
        title={t('in-custom-dashboards:widgets.slo.sliSummary.timeWindow')}
        timeFrameLabel={t('in-custom-dashboards:widgets.slo.sliSummary.timeWindowType', {
          context: timeWindowType
        })}
        fromTimestamp={fromTimestamp}
        toTimestamp={toTimestamp}
        compact={isCompact}
      />
    </div>
  );
}

export default SliSummary;
