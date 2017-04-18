import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import {
  getColorForEventAtFocusedMomentAsStream,
  fireCallbacksForEventAtFocusedMomentAsStream
} from 'in-stores/events';
import { getIconTypeForEventType, getEventType, selectEvent, EVENT_TYPES } from 'in-services/issueTracker';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/Grid/Grid';
import { getClassName } from 'in-services/react';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import ObjectiveContent from './ObjectiveContent';
import IncidentContent from './IncidentContent';
import EventContent from './EventContent';

import './EventDescription.less';

const block = 'in-event-description';

export default connectTo(
  props => {
    return {
      // TODO respect context: Is this relative to focused moment or relative to server time?
      color: getColorForEventAtFocusedMomentAsStream(props.event),
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
    };
  },
  class extends React.Component {
    static displayName = 'EventDescription';

    static propTypes = {
      snapshotId: rpt.string.isRequired,
      showFullTextIfToLong: rpt.bool,
      color: rpt.string.isRequired,
      event: irpt.map.isRequired,
      className: rpt.string,
      isOpen: rpt.bool
    };

    render() {
      const event = this.props.event;
      const eventType = getEventType(event);
      const className = getClassName(this, block);
      const start = event.get('start');
      const end = event.get('end');

      return (
        <div className={className} onClick={() => selectEvent(event)}>
          <SvgIcon
            className={block + '__icon'}
            type={getIconTypeForEventType(eventType)}
            width={16}
            height={16}
            color={this.props.color}
          />
          <div className={block + '__description'}>
            <Row className={getClassName(this, block, '__time')}>
              <Col cols={6}>
                {eventType === EVENT_TYPES.INCIDENT ? 'Triggered:' : 'Started:'}
                <br />
                {formatDateTime(event.get('triggeringTime', event.get('start')))}
              </Col>

              {!this.props.isOpen && start !== end
                ? <Col cols={6} className={block + '__end'}>
                    Ended:<br />{formatDateTime(end)}
                  </Col>
                : null}
            </Row>

            {this.getContent(event, eventType, this.props.color, this.props.showFullTextIfToLong)}
          </div>
        </div>
      );
    }

    getContent = (event, eventType, color, showFullTextIfToLong = true) => {
      let content;
      if (eventType === EVENT_TYPES.INCIDENT) {
        content = <IncidentContent incident={event} />;
      } else if (eventType === EVENT_TYPES.OBJECTIVE) {
        content = <ObjectiveContent objective={event} />;
      } else {
        content = (
          <EventContent
            snapshotId={this.props.snapshotId}
            showFullTextIfToLong={showFullTextIfToLong}
            event={event}
            color={color}
          />
        );
      }

      return content;
    };
  }
);
