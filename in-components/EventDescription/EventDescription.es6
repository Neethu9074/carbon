import irpt from 'react-immutable-proptypes';
import moment from 'moment';
import React from 'react';

import * as issueTracker from 'in-services/issueTracker';
import {getClassName} from 'in-services/react';
import Icon from 'in-components/Icon';

import IncidentContent from './IncidentContent';
import EventContent from './EventContent';

import './EventDescription.less';


const rpt = React.PropTypes;
const block = 'in-event-description';

export default React.createClass({

  displayName: 'EventDescription',

  propTypes: {
    snapshotId: rpt.string.isRequired,
    event: irpt.map.isRequired,
    className: rpt.string
  },

  render() {
    const event = this.props.event;
    const color = issueTracker.getColorForEvent(event);
    const eventType = issueTracker.getEventType(event);
    const className = getClassName(this, block);

    return (
      <div className={className}
           onClick={() => issueTracker.selectEvent(event)}>
        <Icon className={block + '__icon'}
              type={issueTracker.getIconTypeForEventType(eventType)}
              style={{color}}/>
        <div className={block + '__description'}>
          <div className={getClassName(this, block, '__time')}>
            {moment(event.get('start')).fromNow()}
          </div>

          {this.getContent(event, eventType, color)}
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
});
