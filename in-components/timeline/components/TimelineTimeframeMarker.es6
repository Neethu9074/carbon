import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {timeframe$, setTo, timelineScale$} from 'in-components/timeline/timelineStore';
import {bigBangTimestamp$, timeframeShape} from 'in-stores/timeline';
import {onMove, onUp} from 'in-services/reactiveMouseEvents';
import {serverTime$} from 'in-stores/serverTime';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';

import './TimelineTimeframeMarker.less';


const block = 'in-timeline-timeframe-marker';
const rpt = React.PropTypes;

export default connectTo({
    bigBangTimestamp: bigBangTimestamp$,
    serverTime: serverTime$.throttle(10000),
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
      bigBangTimestamp: rpt.number,
      timeframe: timeframeShape,
      serverTime: rpt.number,
      scale: rpt.object
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
      const bigBangTimestamp = this.props.bigBangTimestamp;
      const serverTime = this.props.serverTime;
      const timeframe = this.props.timeframe;

      if (!timeframe || !bigBangTimestamp || !serverTime) {
        return null;
      }

      const to = timeframe.to ? timeframe.to : serverTime;

      const scale = createScale();
      scale.setDomainFrom(bigBangTimestamp);
      scale.setDomainTo(serverTime);
      scale.setRangeFrom(0);
      scale.setRangeTo(100);

      const left = Math.max(0, scale.getRange(to - timeframe.windowSize));
      const width = Math.min(100, scale.getRange(to) - left);

      return (
        <div className={block}>
          <div className={block + '__marker'}
               onMouseDown={this.onMouseDown}
               style={{
                 left: left + '%',
                 width: width + '%'
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

    mouseMoved(deltaX) {
      const bigBangTimestamp = this.props.bigBangTimestamp;
      const serverTime = this.props.serverTime;
      const timeframe = this.props.timeframe;
      const to = timeframe.to ? timeframe.to : serverTime;
      const scale = this.props.scale;

      const percents = deltaX / (scale.getRangeTo() - scale.getRangeFrom());
      const timeMoved = percents * (serverTime - bigBangTimestamp);

      const newToTimestamp = Math.max(bigBangTimestamp + timeframe.windowSize, Math.min(serverTime, to - timeMoved));

      setTo(newToTimestamp);
    }
  })
);
