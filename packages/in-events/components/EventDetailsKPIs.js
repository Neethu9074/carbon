import { combineLatest } from '@instana/observables';
import React from 'react';

import { getEventType, EVENT_TYPES, fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import getRecentEvents$ from 'in-events/recentEvents';
import { alwaysNull } from 'in-services/fixedStreams';
import { serverTime$ } from 'in-stores/serverTime';
import KpiCard from 'in-new-components/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default function EventDetailsKPIs({ event, isIncident }) {
  if (isIncident) {
    return <IncidentKPIs event={event} />;
  }

  return <EventKPIs event={event} />;
}

function EventKPIs({ event }) {
  const started = getEventType(event) === EVENT_TYPES.CHANGE ? 'Time' : 'Started';

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
          <DateTimeKpiCard title="Triggered" time={event.get('triggeringTime', event.get('start'))} />
        </Col>
        <Col xs>
          <Ended event={event} />
        </Col>
        <Col xs>
          <Duration event={event} />
        </Col>
        <Col xs>
          <KpiCard title="Active" value={`${numOpenEvents}/${recentEvents.length}`} raw />
        </Col>
        <Col xs>
          <KpiCard title="Changes" value={`${changes.length}`} raw />
        </Col>
        <Col xs>
          <KpiCard title="Affected entities" value={`${Object.keys(affectedEnties).length}`} raw />
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
      <KpiCard title="Ended" value={valueMissingPlaceholder} raw />
    ) : (
      <DateTimeKpiCard title="Ended" time={event.get('start') !== event.get('end') ? event.get('end') : null} />
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

    return <KpiCard title="Duration" value={value} raw />;
  }
);
