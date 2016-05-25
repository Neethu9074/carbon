import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  timeframe$,
  timelineScale$,
  MIN_ZOOM_LEVEL
} from 'in-components/timeline/timelineStore';
import {onMove, onUp} from 'in-services/reactiveMouseEvents';
import {timeframeShape} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimelineTimeframeMarker.less';


const block = 'in-timeline-timeframe-marker';

export default connectTo({
    scale: timelineScale$,
    timeframe: timeframe$
  },
  React.createClass({

    displayName: 'TimelineTimeframeMarker',

    mixins: [
      PureRenderMixin
    ],

    subscription: null,
    lastXPosition: null,

    propTypes: {
      scale: React.PropTypes.object,
      timeframe: timeframeShape
    },

    componentWillMount() {
      this.onUpSubscription = onUp(window, () => {
        this.lastXPosition = null;
        if (this.subscription) {
          this.subscription.dispose();
        }
      });
    },

    componentWillUnmount() {
      this.onUpSubscription.dispose();
    },

    render() {
      const timeframe = this.props.timeframe;
      if (!timeframe) {
        return null;
      }

      const width = (timeframe.windowSize / MIN_ZOOM_LEVEL) * 100 + '%';
      const right = 0 + 'px';

      return (
        <div className={block}>
          <div className={block + '__marker'}
               onMouseDown={this.onMouseDown}
               style={{
                 width,
                 right
               }}/>
        </div>
      );
    },

    onMouseDown(event) {
      this.lastXPosition = event.screenX;
      this.subscription = onMove(window, e => {
        this.mouseMoved(this.lastXPosition - e.screenX);
        this.lastXPosition = e.screenX;
      });
    },

    mouseMoved() {

    }
  })
);
