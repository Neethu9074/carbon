import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import { highlightedEventScreenPosition$ } from 'in-components/timeline/timelineStore';
import EventDescription from 'in-components/EventDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import { highlightedEvent$ } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EventTooltip.less';

const block = 'in-timeline-event-tooltip';
const xOffset = -10;
const yOffset = 220;

export default connectTo(
  {
    highlightedEventScreenPosition: highlightedEventScreenPosition$,
    highlightedEvent: highlightedEvent$
  },
  React.createClass({
    displayName: 'EventTooltip',

    mixins: [PureRenderMixin],

    propTypes: {
      highlightedEventScreenPosition: rpt.shape({
        x: rpt.number.isRequired,
        y: rpt.number.isRequired
      }),
      highlightedEvent: irpt.map
    },

    render() {
      const highlightedEventScreenPosition = this.props.highlightedEventScreenPosition;
      const highlightedEvent = this.props.highlightedEvent;

      if (!highlightedEvent || !highlightedEventScreenPosition) {
        return null;
      }

      const style = {
        bottom: yOffset - highlightedEventScreenPosition.y
      };

      let anchor;
      if (highlightedEventScreenPosition.x > window.innerWidth / 2) {
        style.right = window.innerWidth - highlightedEventScreenPosition.x + xOffset;
        anchor = 'bottom__right';
      } else {
        style.left = highlightedEventScreenPosition.x + xOffset;
        anchor = 'bottom__left';
      }

      return (
        <div className={block} style={style}>
          <TooltipFrame anchor={anchor}>
            <EventDescription
              event={highlightedEvent}
              showFullTextIfToLong={false}
              snapshotId={highlightedEvent.getIn(['problem', 'snapshotId'], '')}
            />
          </TooltipFrame>
        </div>
      );
    }
  })
);
