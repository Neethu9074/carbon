import irpt from 'react-immutable-proptypes';
import React from 'react';

import {
  getColorForEventAtFocusedMomentAsStream,
  fireCallbacksForEventAtFocusedMomentAsStream
} from 'in-stores/events';
import {formatDateTime} from 'in-services/formatters/date';
import {
  getIconTypeForEventType,
  getEventType,
  selectEvent,
  EVENT_TYPES
} from 'in-services/issueTracker';
import {Row, Col} from 'in-components/Grid/Grid';
import {getClassName} from 'in-services/react';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import IncidentContent from './IncidentContent';
import EventContent from './EventContent';

import './EventDescription.less';


const block = 'in-event-description';
const rpt = React.PropTypes;

export default connectTo(props => {
    return {
      // TODO respect context: Is this relative to focused moment or relative to server time?
      color: getColorForEventAtFocusedMomentAsStream(props.event),
      isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
    };
  }, React.createClass({
  displayName: 'EventDescription',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    showFullTextIfToLong: rpt.bool,
    color: rpt.string.isRequired,
    event: irpt.map.isRequired,
    className: rpt.string,
    isOpen: rpt.bool
  },

  render() {
    const event = this.props.event;
    const eventType = getEventType(event);
    const className = getClassName(this, block);
    const start = event.get('start');
    const end = event.get('end');

    return (
      <div className={className}
           onClick={() => selectEvent(event)}>
        <Icon className={block + '__icon'}
              type={getIconTypeForEventType(eventType)}
              style={{color: this.props.color}}/>
        <div className={block + '__description'}>
          <Row className={getClassName(this, block, '__time')}>
            <Col cols={6}>
              Started:<br/>
              {formatDateTime(start)}
            </Col>

            {!this.props.isOpen && start !== end ?
              <Col cols={6}
                   className={block + '__end'}>
                Ended:<br/>{formatDateTime(end)}
              </Col>
            : null}
          </Row>

          {this.getContent(event, eventType, this.props.color, this.props.showFullTextIfToLong)}
        </div>
      </div>
    );
  },

  getContent(event, eventType, color, showFullTextIfToLong = true) {
    return (
      eventType === EVENT_TYPES.INCIDENT ?
      <IncidentContent incident={event}/> :
      <EventContent snapshotId={this.props.snapshotId}
                    showFullTextIfToLong={showFullTextIfToLong}
                    event={event}
                    color={color}/>
    );
  }
}));
