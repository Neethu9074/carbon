/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { interval } from '@instana/observables';
import { groupBy, chunk } from 'lodash';
import { t } from 'in-i18n';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import SloViolationsChart from 'in-internal/components/SloViolationsChart';
import { getSnapshots, getPhysicalHierarchy } from 'in-stores/snapshot';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { Row, Col } from 'in-new-components/layout/Grid';
import { siPrefix } from 'in-services/formatters/number';
import getRawEvents from 'in-subscription/getRawEvents';
import { getColorBySeverity } from 'in-stores/events';
import { timeConfig$ } from 'in-stores/time/config';
import MetricValue from 'in-components/MetricValue';
import { getSingular } from 'in-sdk/pluginName';
import getEvent from 'in-subscription/event';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import { minutes } from 'in-services/time';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './SloViolations.mless';

const onlySlosQuery =
  '((event.text:"[SREInfaSLO]" OR event.text:"[SRESLO]" OR event.text:"[TUSLO]" OR event.text:"[ExpTUSLO]" OR event.text:"[DevTUSLO]") AND event.state:open)';

export default connect({
  timeConfig: timeConfig$,
  events: timeConfig$.flatMap(timeConfig =>
    interval(minutes.toMillis(1))
      .startWith(null)
      .flatMap(() =>
        getRawEvents({
          timeConfig,
          query: onlySlosQuery,
          pagination: {
            cursor: null,
            retrievalSize: 200
          },
          order: {
            by: 'start',
            direction: 'DESC'
          }
        })
          .filter(result => result.data)
          .map(result => result.data.items.filter(e => e.entityType === 'Entity10'))
      )
  )
})(SloViolations);

function SloViolations({ events, timeConfig }) {
  if (!events) {
    return (
      <div className={locals.wrapper}>
        <LoadingIndicator />
      </div>
    );
  }

  const grouped = groupBy(events, e => e.entityId);
  const chunks = chunk(Object.keys(grouped).sort(), 2);

  return (
    <div className={locals.wrapper}>
      <h1 className={locals.header}>{t('in-internal:monitoringUnit.sloViolations.sloViolateGroupedProc')}</h1>
      <Row>
        <Col lg={12}>
          <SloViolationsChart timeConfig={timeConfig} />
        </Col>
      </Row>

      {chunks.map((itemsInChunk, i) => (
        <Row key={i} verticallyStretchColumns>
          {itemsInChunk.map(id => (
            <Col lg={12 / itemsInChunk.length} key={id}>
              <ViolationsForEntity snapshotId={id} events={grouped[id]} />
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
}

const ViolationsForEntity = connect(({ snapshotId }) => ({
  context: getPhysicalHierarchy({ snapshotId, includeCluster: false })
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
    return <LoadingIndicator />;
  }

  return (
    <div className={locals.violationsForEntity}>
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
    </div>
  );
});

const Event = connect(({ event }) => ({
  fullEvent: getEvent({ eventId: event.id })
}))(function Event({ event, fullEvent }) {
  const metric = fullEvent && fullEvent.getIn(['metadata', 'metrics', 0, 'metricName']);
  const snapshotId = fullEvent && fullEvent.getIn(['metadata', 'metrics', 0, 'snapshotId']);

  return (
    <div className={locals.event}>
      <SvgIcon
        className={locals.icon}
        type={event.severity < 10 ? 'warning' : 'critical'}
        size="xxs"
        color={getColorBySeverity(event.severity)}
      />

      <Tooltip align="topMiddle" content={t('in-internal:monitoringUnit.sloViolations.issueOpenNotAutoUpdate')}>
        <span className={locals.duration}>{formatDurationAccurately(Date.now() - event.start)}</span>
      </Tooltip>

      {metric && snapshotId && (
        <MetricValue
          className={locals.metric}
          formatter={siPrefix.detailed}
          snapshotId={snapshotId}
          createMetricValueStream={() =>
            getTimeWindowBasedMetricAggregation({
              snapshotId: snapshotId,
              metric: metric,
              timeWindowAggregation: 'MEAN'
            }).filter(v => v != null)
          }
        />
      )}

      <Link
        className={locals.title}
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
});
