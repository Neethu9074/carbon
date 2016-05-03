import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {highlightedEventScreenPosition$} from 'in-components/timeline/timelineStore';
import EventDescription from 'in-components/EventDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import {highlightedEvent$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventTooltip.less';


const block = 'in-timeline-event-tooltip';
const rpt = React.PropTypes;
const xOffset = -10;
const yOffset = 220;

export default connectTo({
    highlightedEventScreenPosition: highlightedEventScreenPosition$,
    highlightedEvent: highlightedEvent$
  },
  React.createClass({

    displayName: 'EventTooltip',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      highlightedEventScreenPosition: rpt.object,
      highlightedEvent: irpt.map
    },

    render() {
      const highlightedEventScreenPosition = this.props.highlightedEventScreenPosition;
      const highlightedEvent = this.props.highlightedEvent;

      if (!highlightedEvent || !highlightedEventScreenPosition) {
        return null;
      }

      return (
        <div className={block}
             style={{
               left: highlightedEventScreenPosition.x + xOffset,
               bottom: yOffset - highlightedEventScreenPosition.y
             }}>
           <TooltipFrame anchor='bottom'>
             <EventDescription event={highlightedEvent}
                               snapshotId={highlightedEvent.getIn(['problem', 'snapshotId'], '')}/>
           </TooltipFrame>
        </div>
      );
    }
  })
);
