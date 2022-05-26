/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-restricted-imports
import { useMediaQuery } from '@material-ui/core';
import React from 'react';

import SliSummarySkeleton from 'in-custom-dashboards/widgets/Slo/components/SliSummary/SliSummarySkeleton';
import { useSliFormatter } from 'in-custom-dashboards/widgets/Slo/hooks/useSliFormatter';
import SloTimeTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTimeTile';
import { TimeWindowType } from 'in-custom-dashboards/widgets/Slo/form';
import SloTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTile';
import { percentage } from 'in-services/formatters/number';
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

export function SliSummary({
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

  return (
    <div className={isCompact ? locals.listContainer : locals.tilesContainer}>
      <SloTile
        title={t('in-custom-dashboards:widgets.slo.sliSummary.status')}
        value={sli !== undefined ? percentage.detailed(sli) : undefined}
        budgetTitle={t('in-custom-dashboards:widgets.slo.sliSummary.target')}
        budget={slo !== undefined ? percentage.detailed(slo) : undefined}
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
