import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  timeframe$,
  MAX_ZOOM_LEVEL
} from 'in-components/timeline/timelineStore';
import {timeframeShape} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimelineTimeframeMarker.less';


const block = 'in-timeline-timeframe-marker';

export default connectTo({
    timeframe: timeframe$
  },
  React.createClass({

    displayName: 'TimelineTimeframeMarker',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      timeframe: timeframeShape
    },

    render() {
      const timeframe = this.props.timeframe;
      if (!timeframe) {
        return null;
      }

      const width = (timeframe.windowSize / (MAX_ZOOM_LEVEL))  * 100 + '%';
      const right = 0 + 'px';

      return (
        <div className={block}>
          <div className={block + '__marker'}
               style={{
                 width,
                 right
               }}/>
        </div>
      );
    }
  })
);
