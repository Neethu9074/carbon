/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { getSliFormatter } from 'in-custom-dashboards/widgets/Slo/sliFormatter';
import SloTimeTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTimeTile';
import SloTile from 'in-custom-dashboards/widgets/Slo/Tiles/SloTile';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/WidgetHeader.mless';

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
}) {
  const sloSpent = slo != null && sli != null && sli < slo;
  const budgetSpent = remaining != null && remaining <= 0;
  const sliFormatter = getSliFormatter(sliEntity);

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
          info={
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
          info={
            isDynamic
              ? t('in-custom-dashboards:widgets.slo.widgetHeader.dynamicTimeWindow')
              : isRolling
              ? t('in-custom-dashboards:widgets.slo.widgetHeader.rollingTimeWindow')
              : t('in-custom-dashboards:widgets.slo.widgetHeader.fixedTimeWindow')
          }
          fromTimestamp={fromTimestamp}
          toTimestamp={toTimestamp}
          smallRowStyle
        />
      </div>
    </>
  );
}

export default WidgetHeader;
