/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import { t } from 'in-i18n';

import TypeHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/TypeHeader';
import renderers from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers';
import { millisToTwoDecimalSeconds } from 'in-services/formatters/number';

import locals from './OverviewChartTooltip.mless';

export default function OverviewChartTooltip({ beacon, earliestTimestamp }) {
  const beaconRenderers = renderers[beacon.type];
  if (!beaconRenderers) {
    return null;
  }

  const extraFields = beaconRenderers.getExtraTooltipFields(beacon);

  return (
    <div className={locals.tooltipWrapper}>
      <div className={locals.labelRow}>
        <TypeHeader beacon={beacon} />
        <span className={locals.label}>{beaconRenderers.getLabel(beacon)}</span>
      </div>

      <dl className={locals.timings}>
        {!beaconRenderers.hideStartTimeTooltipField && (
          <div className={locals.timing}>
            <dt className={locals.key}>{t('in-mobile-apps:sessionView.tabsSumOverviewChartTooltipStartTime')}</dt>
            <dd className={locals.value}>+{millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}</dd>
          </div>
        )}

        {Object.keys(extraFields).map((label, i) => (
          <div key={i} className={locals.timing}>
            <dt className={locals.key}>{label}</dt>
            <dd className={locals.value}>{extraFields[label]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
