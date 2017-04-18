import rpt from 'prop-types';
import React from 'react';

import { timeframe$, setTo, timelineScale$, fixFocusedMomentIfNotFixed } from 'in-components/timeline/timelineStore';
import { bigBangTimestamp$, timeframeShape } from 'in-stores/timeline';
import { onMove, onUp } from 'in-services/reactiveMouseEvents';
import { serverTime$ } from 'in-stores/serverTime';
import createScale from 'in-charts/scale';
import connectTo from 'in-hoc/connectTo';

import './TimelineTimeframeMarker.less';

const block = 'in-timeline-timeframe-marker';

export default connectTo(
  {
    serverTime: serverTime$.throttle(10000),
    bigBangTimestamp: bigBangTimestamp$,
    scale: timelineScale$,
    timeframe: timeframe$
  },
  class extends React.PureComponent {
    static displayName = 'TimelineTimeframeMarker';

    static propTypes = {
      bigBangTimestamp: rpt.number,
      timeframe: timeframeShape,
      serverTime: rpt.number,
      scale: rpt.object
    };

    lastXPosition = null;
    subscription = null;

    componentWillMount() {
      this.onUpSubscription = onUp(window, () => {
        this.lastXPosition = null;
        if (this.subscription) {
          this.subscription.dispose();
        }
      });
    }

    componentWillUnmount() {
      this.onUpSubscription.dispose();
    }

    render() {
      const bigBangTimestamp = this.props.bigBangTimestamp;
      const serverTime = this.props.serverTime;
      const timeframe = this.props.timeframe;

      if (!timeframe || !bigBangTimestamp || !serverTime) {
        return null;
      }

      const scale = createScale();
      scale.setDomainFrom(bigBangTimestamp);
      scale.setDomainTo(serverTime);
      scale.setRangeFrom(0);
      scale.setRangeTo(100);

      // min-width 1%, but clamp to left and right
      const to = timeframe.to ? timeframe.to : serverTime;
      const right = Math.min(100, scale.getRange(to));
      const left = Math.max(0, scale.getRange(to - timeframe.windowSize));
      const width = Math.max(1, right - left);
      const leftWidthAdjusted = Math.max(0, right - width);

      return (
        <div className={block}>
          <div
            className={block + '__marker'}
            onMouseDown={this.onMouseDown}
            style={{
              left: leftWidthAdjusted + '%',
              width: width + '%'
            }}
          />
        </div>
      );
    }

    onMouseDown = event => {
      this.lastXPosition = event.screenX;
      this.subscription = onMove(window, e => {
        this.mouseMoved(this.lastXPosition - e.screenX);
        this.lastXPosition = e.screenX;
      });

      fixFocusedMomentIfNotFixed();
    };

    mouseMoved = deltaX => {
      const bigBangTimestamp = this.props.bigBangTimestamp;
      const serverTime = this.props.serverTime;
      const timeframe = this.props.timeframe;
      const to = timeframe.to ? timeframe.to : serverTime;
      const scale = this.props.scale;

      const percents = deltaX / (scale.getRangeTo() - scale.getRangeFrom());
      const timeMoved = percents * (serverTime - bigBangTimestamp);

      const newToTimestamp = Math.max(bigBangTimestamp + timeframe.windowSize, Math.min(serverTime, to - timeMoved));

      setTo(newToTimestamp);
    };
  }
);
