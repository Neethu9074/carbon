import { groupBy, chunk } from 'lodash';
import React from 'react';

import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getSnapshots, getPhysicalHierarchy } from 'in-stores/snapshot';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { Row, Col } from 'in-new-components/layout/Grid';
import { getColorBySeverity } from 'in-stores/events';
import getRawEvents from 'in-subscription/rawEvents';
import { timeConfig$ } from 'in-stores/time/config';
import { getSingular } from 'in-sdk/pluginName';
import SvgIcon from 'in-components/SvgIcon';
import Card from 'in-new-components/Card';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './SloViolations.mless';

const onlySlosQuery =
  '((event.text:"[SLO]" OR event.text:"[experimental SLO]") AND event.state:open) AND (event.type:issue)';

export default connect({
  events: timeConfig$.flatMap(timeConfig =>
    getRawEvents({
      timeConfig,
      maxTimestamp: timeConfig.to || Date.now(),
      minTimestamp: (timeConfig.to || Date.now()) - timeConfig.windowSize,
      sortByField: 'start',
      sortMode: 'desc',
      query: onlySlosQuery,
      offset: 0,
      size: 200
    }).map(events => events.toJS().filter(e => e.entityType === 'Entity10'))
  )
})(SloViolations);

function SloViolations({ events }) {
  if (!events) {
    return (
      <div className={locals.wrapper}>
        <LoadingIndicator type="dark" />
      </div>
    );
  }

  const grouped = groupBy(events, e => e.entityId);
  const chunks = chunk(Object.keys(grouped).sort(), 2);

  return (
    <div className={locals.wrapper}>
      <h1>SLO Violations Grouped By Process</h1>

      {chunks.map(([a, b], i) => (
        <Row key={i}>
          {a && (
            <Col lg={6}>
              <ViolationsForEntity snapshotId={a} events={grouped[a]} />
            </Col>
          )}
          {b && (
            <Col lg={6}>
              <ViolationsForEntity snapshotId={b} events={grouped[b]} />
            </Col>
          )}
        </Row>
      ))}
    </div>
  );
}

const ViolationsForEntity = connect(({ snapshotId }) => ({
  context: getPhysicalHierarchy(snapshotId, false)
    .flatMap(getSnapshots)
    .map(snapshots =>
      snapshots.reduce((agg, snapshot, i) => {
        if (snapshot) {
          agg[snapshot.get('plugin')] = snapshot;
          if (i === 0) {
            agg.mostSpecific = snapshot;
          }
        }
        return agg;
      }, {})
    )
    .filter(c => c.mostSpecific)
}))(function ViolationsForEntity({ context, events }) {
  if (!context) {
    return <LoadingIndicator type="dark" />;
  }

  let cardTitle = context.mostSpecific.get('label');
  if (context.docker) {
    cardTitle = context.docker.get('label');
  }

  return (
    <Card title={`${cardTitle} (${events.length})`}>
      <Dl>
        <Di title={getSingular(context.mostSpecific.get('plugin'))}>
          <Link href$={getDashboardLink(context.mostSpecific.get('id'), { pathname: physicalDashboardPath })}>
            {context.mostSpecific.get('label')}
          </Link>
        </Di>

        {context.docker && (
          <Di title={getSingular(context.docker.get('plugin'))}>
            <Link href$={getDashboardLink(context.docker.get('id'), { pathname: physicalDashboardPath })}>
              {context.docker.get('label')}
            </Link>
          </Di>
        )}

        {context.host && (
          <Di title={getSingular(context.host.get('plugin'))}>
            <Link href$={getDashboardLink(context.host.get('id'), { pathname: physicalDashboardPath })}>
              {context.host.get('label')}
            </Link>
          </Di>
        )}
      </Dl>

      {events.map(e => (
        <Event event={e} key={e.id} />
      ))}
    </Card>
  );
});

function Event({ event }) {
  return (
    <div className={locals.event}>
      <SvgIcon
        className={locals.icon}
        type={event.severity < 10 ? 'warning' : 'critical'}
        height={12}
        color={getColorBySeverity(event.severity)}
      />
      <span className={locals.duration}>{formatDurationAccurately(Date.now() - event.start)}</span>
      <Link
        href$={getEventsViewFilteredBy({
          query: onlySlosQuery,
          eventId: event.id,
          eventTypeFilter: 'issue'
        })}
      >
        {event.title}
      </Link>
    </div>
  );
}
