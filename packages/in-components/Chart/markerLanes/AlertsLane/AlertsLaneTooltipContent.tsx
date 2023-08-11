/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AlertClusterResponse, AlertResponse } from '@instana/types';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './AlertsLaneTooltipContent.mless';

export default function AlertsLaneTooltipContent({ smartAlerts = [], incidents = [] }: AlertClusterResponse) {
  const smartAlertsCount = smartAlerts?.length;
  const incidentsCount = incidents?.length;

  const hasSmartAlerts = !!smartAlertsCount;
  const hasIcidents = !!incidentsCount;

  const countSmartAlertI18nKey = 'in-components:chart.chartAlertsLaneTooltipContent.countSmartAlert';
  const countIncidentI18nKey = 'in-components:chart.chartAlertsLaneTooltipContent.countIncident';

  return (
    <>
      {hasIcidents && hasSmartAlerts ? (
        <div>
          {t('in-components:chart.chartAlertsLaneTooltipContent.msg', {
            smartAlertsCount: smartAlertsCount,
            incidentsCount: incidentsCount
          })}
        </div>
      ) : (
        <>
          <TooltipItem events={smartAlerts} moreMessageTypeTextI18nKey={countSmartAlertI18nKey} />
          <TooltipItem events={incidents} moreMessageTypeTextI18nKey={countIncidentI18nKey} />
        </>
      )}
    </>
  );
}

interface TooltipItemProps {
  events: AlertResponse[];
  moreMessageTypeTextI18nKey: string;
}

function TooltipItem({ events, moreMessageTypeTextI18nKey }: TooltipItemProps) {
  if (events.length === 0) return null;

  const visibleItemsCount = 2;
  const eventsCount = events.length;

  return (
    <>
      <div className={locals.tooltipContent}>
        {events.slice(0, visibleItemsCount).map(({ name, start }, i: number) => (
          <div key={`${start}${i}`}>
            <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
            <div className={locals.name}>{`${name}`}</div>
          </div>
        ))}
      </div>
      {eventsCount > visibleItemsCount && (
        <div>
          {t('in-components:chart.chartAlertsLaneTooltipContent.itemMsg', {
            leftCount: eventsCount - visibleItemsCount,
            moreMsg: t(moreMessageTypeTextI18nKey, { count: eventsCount })
          })}
        </div>
      )}
    </>
  );
}
