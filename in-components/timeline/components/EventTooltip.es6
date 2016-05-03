import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {highlightedEventXPosition$} from 'in-components/timeline/timelineStore';
import EventDescription from 'in-components/EventDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import {highlightedEvent$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventTooltip.less';


const block = 'in-timeline-event-tooltip';
const rpt = React.PropTypes;

export default connectTo({
    highlightedEventXPosition: highlightedEventXPosition$,
    highlightedEvent: highlightedEvent$
  },
  React.createClass({

    displayName: 'EventTooltip',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      highlightedEventXPosition: rpt.number,
      highlightedEvent: irpt.map
    },

    render() {
      const highlightedEventXPosition = this.props.highlightedEventXPosition;
      const highlightedEvent = this.props.highlightedEvent;

      if (!highlightedEvent || !highlightedEventXPosition) {
        return null;
      }

      return (
        <div className={block}
             style={{left: this.props.highlightedEventXPosition}}>
           <TooltipFrame anchor='bottom'>
             <EventDescription event={highlightedEvent}
                               snapshotId={highlightedEvent.getIn(['problem', 'snapshotId'])}/>
           </TooltipFrame>
        </div>
      );
    }
  })
);
