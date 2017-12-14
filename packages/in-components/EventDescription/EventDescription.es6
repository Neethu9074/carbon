import React from 'react';

import {
  getColorForEventAtFocusedMomentAsStream,
  fireCallbacksForEventAtFocusedMomentAsStream,
  getIconTypeForEventType,
  getEventType,
  EVENT_TYPES
} from 'in-stores/events';
import { focusEvent } from 'in-stores/navigation/paths/eventPaths';
import { evaluateClassNames } from 'in-services/util/classnames';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/Grid/Grid';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import IncidentContent from './IncidentContent';
import EventContent from './EventContent';

import './EventDescription.less';

const block = 'in-event-description';

export default connectTo(
  props => {
    return {
      color: getColorForEventAtFocusedMomentAsStream(props.event),
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
    };
  },
  function EventDescription({ snapshotId, showFullTextIfToLong, color, event, isNotClickable, className, isOpen }) {
    const eventType = getEventType(event);
    const start = event.get('start');
    const end = event.get('end');

    return (
      <div
        className={evaluateClassNames({
          [`${block}`]: true,
          [`${className}`]: className
        })}
        onClick={() => {
          if (!isNotClickable) {
            focusEvent(event.get('id'));
          }
        }}
      >
        <SvgIcon
          className={`${block}__icon`}
          type={getIconTypeForEventType(eventType)}
          width={16}
          height={16}
          color={color}
        />
        <div className={`${block}__description`}>
          <Row
            className={evaluateClassNames({
              [`${block}__time`]: true,
              [`${className}__time`]: className
            })}
          >
            <Col cols={6}>
              {eventType === EVENT_TYPES.INCIDENT ? 'Triggered:' : 'Started:'}
              <br />
              {formatDateTime(event.get('triggeringTime', event.get('start')))}
            </Col>

            {!isOpen && start !== end ? (
              <Col cols={6} className={block + '__end'}>
                Ended:<br />
                {formatDateTime(end)}
              </Col>
            ) : null}
          </Row>

          <Content snapshotId={snapshotId} event={event} color={color} showFullTextIfToLong={showFullTextIfToLong} />
        </div>
      </div>
    );
  }
);

function Content({ snapshotId, event, color, showFullTextIfToLong = true }) {
  const eventType = getEventType(event);

  if (eventType === EVENT_TYPES.INCIDENT) {
    return <IncidentContent incident={event} />;
  }
  return (
    <EventContent snapshotId={snapshotId} showFullTextIfToLong={showFullTextIfToLong} event={event} color={color} />
  );
}
