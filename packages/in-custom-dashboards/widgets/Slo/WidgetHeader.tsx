/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useSliFormatter } from 'in-custom-dashboards/widgets/Slo/hooks/useSliFormatter';
import SloTimeTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTimeTile';
import SloTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTile';
import { percentage } from 'in-services/formatters/number';
import { SliEntity } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/WidgetHeader.mless';

interface WidgetHeaderProps {
  slo: number | '';
  budget?: number;
  isDynamic?: boolean;
  isRolling?: boolean;
  fromTimestamp: number;
  toTimestamp: number;
  sliEntity?: SliEntity;
  metricSpent?: number;
  metricSli?: number;
  metricRemaining?: number;
}

export function WidgetHeader({
  slo,
  budget,
  isDynamic,
  isRolling,
  fromTimestamp,
  toTimestamp,
  sliEntity,
  metricSpent: spent,
  metricSli: sli,
  metricRemaining: remaining
}: WidgetHeaderProps) {
  const sloSpent = slo != null && sli != null && sli < slo;
  const budgetSpent = remaining != null && remaining <= 0;
  const sliFormatter = useSliFormatter(sliEntity);

  return (
    <>
      <div className={locals.tilesContainer}>
        <SloTile
          title={t('in-custom-dashboards:widgets.slo.widgetHeader.status')}
          value={sli && percentage.detailed(sli)}
          budgetTitle={t('in-custom-dashboards:widgets.slo.widgetHeader.target')}
          budget={slo && percentage.detailed(slo)}
          budgetSpent={sloSpent}
        />
        <SloTile
          title={t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudgetSpent')}
          value={spent && sliFormatter(spent)}
          budgetTitle={t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudget')}
          budget={budget && sliFormatter(budget)}
          budgetSpent={budgetSpent}
        />
        <SloTimeTile
          title={t('in-custom-dashboards:widgets.slo.widgetHeader.timeWindow')}
          timeFrameLabel={
            isDynamic
              ? t('in-custom-dashboards:widgets.slo.widgetHeader.dynamicTimeWindow')
              : isRolling
              ? t('in-custom-dashboards:widgets.slo.widgetHeader.rollingTimeWindow')
              : t('in-custom-dashboards:widgets.slo.widgetHeader.fixedTimeWindow')
          }
          fromTimestamp={fromTimestamp}
          toTimestamp={toTimestamp}
        />
      </div>
      <div className={locals.listContainer}>
        <SloTile
          title={t('in-custom-dashboards:widgets.slo.widgetHeader.status')}
          value={sli && percentage.detailed(sli)}
          budgetTitle={t('in-custom-dashboards:widgets.slo.widgetHeader.target')}
          budget={slo && percentage.detailed(slo)}
          budgetSpent={sloSpent}
          compact
        />
        <SloTile
          title={t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudgetSpent')}
          value={spent && sliFormatter(spent)}
          budgetTitle={t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudget')}
          budget={budget && sliFormatter(budget)}
          budgetSpent={budgetSpent}
          compact
        />
        <SloTimeTile
          timeFrameLabel={
            isDynamic
              ? t('in-custom-dashboards:widgets.slo.widgetHeader.dynamicTimeWindow')
              : isRolling
              ? t('in-custom-dashboards:widgets.slo.widgetHeader.rollingTimeWindow')
              : t('in-custom-dashboards:widgets.slo.widgetHeader.fixedTimeWindow')
          }
          fromTimestamp={fromTimestamp}
          toTimestamp={toTimestamp}
          compact
        />
      </div>
    </>
  );
}

export default WidgetHeader;
