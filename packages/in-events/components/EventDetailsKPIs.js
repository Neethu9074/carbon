/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  getEventType,
  EVENT_TYPES,
  fireCallbacksForEventAtFocusedMomentAsStream,
  getEventSeverityLabel
} from 'in-stores/events';
import { formatDurationAccurately } from 'in-services/formatters/date';
import DateTimeKpiCard from 'in-components/KpiCard/DateTimeKpiCard';
import { formatDate } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import { alwaysNull } from 'in-services/fixedStreams';
import { Row, Col } from 'in-components/layout/Grid';
import { serverTime$ } from 'in-stores/serverTime';
import KpiCard from 'in-components/KpiCard';
import { getEvents } from 'in-events/api';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default function EventDetailsKPIs({ event, isIncident }) {
  const eventType = getEventType(event);
  if (isIncident) {
    return <IncidentKPIs event={event} />;
  }
  if (eventType === EVENT_TYPES.CVE_ISSUE) {
    return <CveKPIs event={event} />;
  }
  return <EventKPIs event={event} />;
}

function EventKPIs({ event }) {
  const started = getEventType(event) === EVENT_TYPES.CHANGE ? t('in-events:titleTime') : t('in-events:headerStarted');

  return (
    <Row withoutSideMargin>
      <Col xs>
        <DateTimeKpiCard title={started} time={event.get('start')} />
      </Col>
      <Col xs>
        <Ended event={event} />
      </Col>
      <Col xs>
        <Duration event={event} />
      </Col>
      <Severity event={event} />
    </Row>
  );
}

const IncidentKPIs = ({ event }) => {
  const recentEvents = useObservable(getEvents(event.get('recentEvents', emptyList).toArray()), [event]) ?? [];
  const affectedEnties = {};
  recentEvents.forEach(e => (affectedEnties[e.snapshotId] = true));

  return (
    <Row withoutSideMargin>
      <Col xs>
        <DateTimeKpiCard title={t('in-events:titleTriggered')} time={event.get('start')} />
      </Col>
      <Col xs>
        <Ended event={event} />
      </Col>
      <Col xs>
        <Duration event={event} />
      </Col>
      <Severity event={event} />
      <Col xs>
        <KpiCard
          title={t('in-events:titleAffectedEntities')}
          value={recentEvents.length ? `${Object.keys(affectedEnties).length}` : null}
          raw
        />
      </Col>
    </Row>
  );
};
function CveKPIs({ event }) {
  const reportedDate = formatDate(event.get('start'));
  const cvssScore = event.getIn(['metadata', 'cve', 'cvssScore']);
  const cveSeverity = event.getIn(['metadata', 'cve', 'severity']);
  return (
    <Row withoutSideMargin>
      <Col xs>
        <KpiCard title={t('in-events:titleReported')} value={reportedDate} raw />
      </Col>
      <Col xs>
        <KpiCard title={t('in-events:titleState')} value={event.get('state')} raw />
      </Col>
      <Col xs>
        <KpiCard title={t('in-events:titleCvssScore')} value={cvssScore} raw />
      </Col>
      <Col xs>
        <KpiCard title={t('in-events:titleCveSeverity')} value={cveSeverity} raw />
      </Col>
    </Row>
  );
}

export const Ended = ({ event }) => {
  const metadata = event.get('metadata');
  const manualCloseTimestamp = metadata ? event.getIn(['metadata', 'manualCloseTimestamp']) : null;
  const hasDuration = getEventType(event) !== EVENT_TYPES.CHANGE ? event.get('start') !== event.get('end') : true;
  const endTime = manualCloseTimestamp ? manualCloseTimestamp : event.get('end');
  const isOpen = event.get('state') === 'open';

  return <DateTimeKpiCard title={t('in-events:titleEnded')} time={!isOpen && hasDuration ? endTime : null} />;
};

export const Duration = connectTo(
  props => {
    // in theory, changes have a duration but we dont want to show it
    if (getEventType(props.event) === EVENT_TYPES.CHANGE) {
      return {
        config: alwaysNull
      };
    }
    let end;
    const isImmutableObject = !!props.event.get;
    // if props.event is a map
    if (isImmutableObject) end = props.event.getIn(['metadata', 'manualCloseTimestamp'], props.event.get('end'));
    // if props.event is an object
    else end = props.event.manualCloseTimestamp || props.event.end;
    return {
      config: serverTime$.flatMap(serverTime =>
        fireCallbacksForEventAtFocusedMomentAsStream(
          props.event,
          ({ timeConfig }) => {
            return {
              to: timeConfig?.focusedMoment ? end : serverTime,
              end: timeConfig?.focusedMoment ? end : null,
              isOpen: true
            };
          },
          () => {
            return {
              to: end,
              end,
              isOpen: false
            };
          }
        )
      )
    };
  },
  function Duration({ event, config, listView }) {
    if (listView) {
      return config ? formatDurationAccurately(config.to - event.start, 1000) : null;
    }
    return (
      <KpiCard
        title={t('in-events:titleDuration')}
        value={config}
        renderValue={config => formatDurationAccurately(config.to - event.get('start'), 1000)}
        raw
      />
    );
  }
);

export const Severity = connectTo(
  ({ event }) => {
    return {
      severity: just(getEventSeverityLabel(event)),
      isChangeEvent: just(getEventType(event) === EVENT_TYPES.CHANGE)
    };
  },
  function Severity({ severity, isChangeEvent }) {
    if (isChangeEvent && severity === '') {
      return null;
    }
    return (
      <Col xs>
        <KpiCard title={t('in-events:titleSeverity')} value={severity} raw />
      </Col>
    );
  }
);
