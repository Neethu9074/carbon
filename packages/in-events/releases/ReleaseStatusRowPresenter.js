import PropTypes from 'prop-types';
import React from 'react';

import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './ReleaseStatusRowPresenter.mless';

export default function ReleaseStatusRowPresenter({ healthStatus, rawEvent, sortDirection }) {
  const { title, start } = rawEvent;

  return (
    <div className={locals.container}>
      {healthStatus && (
        <HealthStatus
          pointerDirection={sortDirection === 'desc' ? 'down' : 'up'}
          name="Since"
          health={healthStatus.before.health}
          incidents={healthStatus.before.incidents}
          time={healthStatus.before.start}
        />
      )}
      <div className={locals.releaseInfo}>
        <SvgIcon className={locals.icon} type="lib_release_rocket" size="xl" />
        <div>
          <div className={locals.releaseName}>Release: {title}</div>
          <div className={locals.releaseTime}>
            Started: &nbsp;
            <time className={locals.releaseDateTime} dateTime={new Date(start).toISOString()}>
              {formatDateTime(start)}
            </time>
          </div>
        </div>
      </div>
      {healthStatus && (
        <HealthStatus
          pointerDirection={sortDirection === 'desc' ? 'up' : 'down'}
          name="Until"
          health={healthStatus.after.health}
          incidents={healthStatus.after.incidents}
          time={healthStatus.after.end}
        />
      )}
    </div>
  );
}

function HealthStatus({ time, incidents, health, name, pointerDirection }) {
  return (
    <div>
      <div className={locals.healthStatus}>
        <span className={locals.headingRow}>
          <SvgIcon className={locals.icon} type={`lib_arrow_expand_${pointerDirection}`} />
          <span className={locals.incidentsHeadline}>Incidents</span>
          <span className={locals.healthIndicator}>{percentageTwoDecimalPlaces(health)} Healthy</span>
        </span>
      </div>
      <div className={locals.numberOfIncidentsLabel}>{incidents} Ongoing</div>
      <div className={locals.timespan}>{`${name} ${formatDateTime(time)}`}</div>
    </div>
  );
}

ReleaseStatusRowPresenter.protoTypes = {
  rawEvent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
  }),
  healthStatus: PropTypes.shape({
    before: PropTypes.shape({
      incidents: PropTypes.number.isRequired,
      health: PropTypes.number.isRequired,
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired
    }).isRequired,
    after: PropTypes.shape({
      incidents: PropTypes.number.isRequired,
      health: PropTypes.number.isRequired,
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired
    }).isRequired
  }),
  sortDirection: PropTypes.string.isRequired
};
