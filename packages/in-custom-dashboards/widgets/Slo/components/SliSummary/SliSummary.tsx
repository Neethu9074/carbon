/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-restricted-imports
import useMediaQuery from '@mui/material/useMediaQuery';
import { isUndefined } from 'lodash';
import React from 'react';

import { getIntlNumberFormatter, NumberFormatter } from '@instana/format-numbers';

import { SLO_TARGET_DECIMAL_PRECISION } from 'in-custom-dashboards/widgets/Slo/components/SloFormComponent';
import SliSummarySkeleton from 'in-custom-dashboards/widgets/Slo/components/SliSummary/SliSummarySkeleton';
import SloTimeTile from 'in-custom-dashboards/widgets/Slo/components/widget/tiles/SloTimeTile';
import { useSliFormatter } from 'in-custom-dashboards/widgets/Slo/hooks/useSliFormatter';
import SloTile from 'in-custom-dashboards/widgets/Slo/components/widget/tiles/SloTile';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { TimeWindowType } from 'in-custom-dashboards/widgets/Slo/form';
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

  const { sloStatus, sloTarget } = formatSloStatus(sli, slo);

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

interface FormatSloStatusResponse {
  sloStatus?: string;
  sloTarget?: string;
}

function formatSloStatus(sloStatus?: number, sloTarget?: number): FormatSloStatusResponse {
  if (isUndefined(sloStatus) || isUndefined(sloTarget)) return {};
  const format = toPercentageFormatter(sloTarget);
  return {
    sloStatus: format(sloStatus) ?? valueMissingPlaceholder,
    sloTarget: format(sloTarget) ?? valueMissingPlaceholder
  };
}

function toPercentageFormatter(input: number): NumberFormatter {
  const minimumFractionDigits = 2;
  const hundredthsDigits = 2;

  // Determines the current decimal places and increments the decimals by one, if necessary,
  // to inform the user whether the specified target has been exceeded.
  const numberStr = input.toFixed(SLO_TARGET_DECIMAL_PRECISION + hundredthsDigits + 2);
  const decimalCount = numberStr.split('.')[1].replace(/0+$/, '').length - hundredthsDigits;
  const displayedFractionDigits = Math.max(decimalCount + 1, minimumFractionDigits);

  return getIntlNumberFormatter({
    minimumFractionDigits,
    maximumFractionDigits: displayedFractionDigits,
    style: 'percent'
  });
}

export default SliSummary;
