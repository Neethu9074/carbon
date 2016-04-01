import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import EventDescription from 'in-components/EventDescription';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {setSelectedIncidentId} from 'in-stores/incident';
import Tooltip from 'in-components/Tooltip';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import './Event.less';

const rpt = React.PropTypes;
const block = 'in-timeline-event';

const Event = React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    mouseOut: rpt.func.isRequired,
    mouseIn: rpt.func.isRequired,
    event: irpt.map.isRequired,
    style: rpt.object
  },

  render() {
    const event = this.props.event;
    const iconType = this.getIconType(event);
    const style = this.props.style ? this.props.style : {};
    const severity = event.getIn(['problem', 'severity']);
    const open = event.get('end') == null;
    style.color = open ? theme.health[severity] : theme.health[0];

    return (
      <Tooltip  align={{vertical: 'top'}}
                content={<EventDescription key={event.get('id')}
                                           event={event}
                                           snapshotId={event.getIn(['problem', 'snapshotId'])}/>}>

        <Icon type={iconType}
              onMouseEnter={() => this.props.mouseIn(event)}
              onClick={this.onClick}
              onMouseLeave={this.props.mouseOut}
              className={block}
              style={style} />
      </Tooltip>
    );
  },

  getIconType(event) {
    switch (getEventType(event)) {
      case EVENT_TYPES.ISSUE_WARNING:
        return 'warning';
      case EVENT_TYPES.ISSUE_CRITICAL:
        return 'critical';
      case EVENT_TYPES.INCIDENT:
        return 'system';
      default:
        return 'change';
    }
  },

  onClick() {
    const eventType = getEventType(this.props.event);

    if (eventType === EVENT_TYPES.INCIDENT) {
      setSelectedIncidentId(event.get('id'));
    } else {
      setSelectedSnapshotId(event.getIn(['problem', 'snapshotId']));
    }
  }
});

export default Event;
