import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import EventDescription from 'in-components/EventDescription';
import * as issueTracker from 'in-services/issueTracker';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './Event.less';


const block = 'in-timeline-event';
const rpt = React.PropTypes;

export default connectTo(props => {
  return {
    color: issueTracker.getColorForEvent(props.event)
  };
}, React.createClass({

    displayName: 'Event',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      mouseOut: rpt.func.isRequired,
      mouseIn: rpt.func.isRequired,
      event: irpt.map.isRequired,
      style: rpt.object,
      color: rpt.any
    },

    render() {
      const event = this.props.event;
      const iconType = issueTracker.getIconTypeForEvent(event, true);
      const style = this.props.style ? this.props.style : {};
      style.color = this.props.color;

      return (
        <Tooltip align={{vertical: 'top'}}
                 content={<EventDescription event={event}
                                            snapshotId={event.getIn(['problem', 'snapshotId'], '')}/>}>

          <Icon type={iconType}
                onMouseEnter={() => this.props.mouseIn(event)}
                onClick={(() => issueTracker.selectEvent(event))}
                onMouseLeave={this.props.mouseOut}
                className={block}
                style={style} />
        </Tooltip>
      );
    }
  })
);
