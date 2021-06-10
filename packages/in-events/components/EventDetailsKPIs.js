/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';

import {
  getEventType,
  EVENT_TYPES,
  fireCallbacksForEventAtFocusedMomentAsStream,
  getEventSeverityLabel
} from 'in-stores/events';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { formatDurationAccurately } from 'in-services/formatters/date';
import DateTimeKpiCard from 'in-components/KpiCard/DateTimeKpiCard';
import getRecentEvents$ from 'in-events/recentEvents';
import { alwaysNull } from 'in-services/fixedStreams';
import { Row, Col } from 'in-components/layout/Grid';
import { serverTime$ } from 'in-stores/serverTime';
import KpiCard from 'in-components/KpiCard';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default function EventDetailsKPIs({ event, isIncident }) {
  if (isIncident) {
    return <IncidentKPIs event={event} />;
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

const IncidentKPIs = connectTo(
  ({ event }) => {
    const recentEvents$ = getRecentEvents$(event).startWith([]);
    return {
      recentEvents: recentEvents$,
      openEvents: recentEvents$.flatMap(_events =>
        combineLatest(
          _events.map(_event =>
            fireCallbacksForEventAtFocusedMomentAsStream(
              _event,
              () => true,
              () => false
            )
          )
        )
      )
    };
  },
  function IncidentKPIs({ event, recentEvents, openEvents }) {
    const changes = recentEvents.filter(e => getEventType(e) === EVENT_TYPES.CHANGE);
    const numOpenEvents = openEvents ? openEvents.filter(Boolean).length : '';
    const affectedEnties = {};
    recentEvents.forEach(e => (affectedEnties[e.getIn(['entityId'])] = true));

    return (
      <Row withoutSideMargin>
        <Col xs>
          <DateTimeKpiCard
            title={t('in-events:titleTriggered')}
            time={event.get('triggeringTime', event.get('start'))}
          />
        </Col>
        <Col xs>
          <Ended event={event} />
        </Col>
        <Col xs>
          <Duration event={event} />
        </Col>
        <Severity event={event} />
        <Col xs>
          <KpiCard title={t('in-events:titleActive')} value={`${numOpenEvents}/${recentEvents.length}`} raw />
        </Col>
        <Col xs>
          <KpiCard title={t('in-events:titleChanges')} value={`${changes.length}`} raw />
        </Col>
        <Col xs>
          <KpiCard title={t('in-events:titleAffectedEntities')} value={`${Object.keys(affectedEnties).length}`} raw />
        </Col>
      </Row>
    );
  }
);

const Ended = connectTo(
  ({ event }) => {
    if (getEventType(event) === EVENT_TYPES.CHANGE) {
      return {};
    }
    return {
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(
        event,
        () => true,
        () => false
      )
    };
  },
  function Ended({ event, isOpen }) {
    return isOpen ? (
      <KpiCard title={t('in-events:titleEnded')} value={valueMissingPlaceholder} raw />
    ) : (
      <DateTimeKpiCard
        title={t('in-events:titleEnded')}
        time={event.get('start') !== event.get('end') ? event.get('end') : null}
      />
    );
  }
);

const Duration = connectTo(
  props => {
    // in theory, changes have a duration but we dont want to show it
    if (getEventType(props.event) === EVENT_TYPES.CHANGE) {
      return {
        config: alwaysNull
      };
    }

    const end = props.event.get('end');
    return {
      config: serverTime$.flatMap(serverTime =>
        fireCallbacksForEventAtFocusedMomentAsStream(
          props.event,
          ({ timeConfig }) => {
            return {
              to: timeConfig.focusedMoment ? end : serverTime,
              end: timeConfig.focusedMoment ? end : null,
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
  function Duration({ event, config }) {
    let value = valueMissingPlaceholder;
    if (config) {
      value = formatDurationAccurately(config.to - event.get('start'), 1000);
    }

    return <KpiCard title={t('in-events:titleDuration')} value={value} raw />;
  }
);

const Severity = connectTo(
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
