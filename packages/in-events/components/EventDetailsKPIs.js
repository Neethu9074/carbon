import React from 'react';

import { getEventType, EVENT_TYPES, fireCallbacksForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import { alwaysNull } from 'in-services/fixedStreams';
import { serverTime$ } from 'in-stores/serverTime';
import KpiCard from 'in-new-components/KpiCard';
import connectTo from 'in-hoc/connectTo';

export default function EventDetailsKPIs({ event }) {
  const eventType = getEventType(event);
  const isIncident = eventType === EVENT_TYPES.INCIDENT;

  if (isIncident) {
    return <IncidentKPIs incident={event} />;
  }

  return <EventKPIs event={event} />;
}

function EventKPIs({ event }) {
  const started = getEventType(event) === EVENT_TYPES.CHANGE ? 'Time' : 'Started';

  return (
    <Row>
      <Col xs>
        <DateTimeKpiCard title={started} time={event.get('start')} />
      </Col>
      <Col xs>
        <Duration event={event} />
      </Col>
    </Row>
  );
}

function IncidentKPIs({ event }) {
  return (
    <Row>
      <Col xs>
        <DateTimeKpiCard title="Started" time={event.get('start')} />
      </Col>
      <Col xs>
        <Duration event={event} />
      </Col>
    </Row>
  );
}

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
      value = formatDurationAccurately(config.to - event.get('start'));
    }

    return <KpiCard title="Duration" value={value} raw />;
  }
);
