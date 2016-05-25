import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {Row, Col} from 'in-components/Grid/Grid';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import * as issueTracker from 'in-services/issueTracker';
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
      color: getColorForEventAtFocusedMomentAsStream(props.event)
    };
  }, React.createClass({
  displayName: 'EventDescription',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    event: irpt.map.isRequired,
    color: rpt.string.isRequired,
    className: rpt.string
  },

  render() {
    const event = this.props.event;
    const eventType = issueTracker.getEventType(event);
    const className = getClassName(this, block);
    const start = event.get('start');
    const end = event.get('end');

    return (
      <div className={className}
           onClick={() => issueTracker.selectEvent(event)}>
        <Icon className={block + '__icon'}
              type={issueTracker.getIconTypeForEventType(eventType)}
              style={{color: this.props.color}}/>
        <div className={block + '__description'}>
          <Row className={getClassName(this, block, '__time')}>
            <Col cols={5}>
              {moment(start).fromNow()}
            </Col>

            {end && start !== end ?
              <Col cols={7}
                   className={block + '__end'}>
                Ended: {formatDateTime(end)}
              </Col>
            : null}
          </Row>

          {this.getContent(event, eventType, this.props.color)}
        </div>
      </div>
    );
  },

  getContent(event, eventType, color) {
    return (
      eventType === issueTracker.EVENT_TYPES.INCIDENT ?
      <IncidentContent incident={event}/> :
      <EventContent snapshotId={this.props.snapshotId}
                    event={event}
                    color={color}/>
    );
  }
}));
