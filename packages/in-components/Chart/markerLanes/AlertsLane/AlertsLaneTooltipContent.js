/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { alertsLaneAlertsPropType } from 'in-components/Chart/markerLanes/AlertsLane/constants';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

import locals from './AlertsLaneTooltipContent.mless';

export default function AlertsLaneTooltipContent({ smartAlerts = [], incidents = [] }) {
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
            smartAlerts: t(countSmartAlertI18nKey, { count: smartAlertsCount }),
            incidentsCount: incidentsCount,
            incidents: t(countIncidentI18nKey, { count: incidentsCount })
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

AlertsLaneTooltipContent.propTypes = {
  incidents: PropTypes.arrayOf(alertsLaneAlertsPropType).isRequired,
  smartAlerts: PropTypes.arrayOf(alertsLaneAlertsPropType).isRequired
};

function TooltipItem({ events, moreMessageTypeTextI18nKey }) {
  if (events.length === 0) return null;

  const visibleItemsCount = 2;
  const eventsCount = events.length;

  return (
    <>
      <div className={locals.tooltipContent}>
        {events.slice(0, visibleItemsCount).map(({ name, start }, i) => (
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
