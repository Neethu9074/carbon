import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {mapSeverityToHealth, health} from 'in-services/health';
import EventDescription from 'in-components/EventDescription';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
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
    const style = this.props.style ? this.props.style : {};
    const severity = event.getIn(['problem', 'severity']);
    const open = event.get('end') == null;
    style.color = open ? theme.health[severity] : theme.health[0];

    let iconType;
    switch (mapSeverityToHealth(severity)) {
      case health.warning:
        iconType = 'warning';
        break;
      case health.danger:
        iconType = 'critical';
        break;
      default:
        iconType = 'change';
    }

    return (
      <Tooltip  align={{vertical: 'top'}}
                content={<EventDescription key={event.get('id')}
                                           event={event}
                                           snapshotId={event.getIn(['problem', 'snapshotId'])}/>}>

        <Icon type={iconType}
              onMouseEnter={() =>this.props.mouseIn(event)}
              onClick={() => setSelectedSnapshotId(event.getIn(['problem', 'snapshotId']))}
              onMouseLeave={this.props.mouseOut}
              className={block}
              style={style} />
      </Tooltip>
    );
  }
});

export default Event;
