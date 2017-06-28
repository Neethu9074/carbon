import React from 'react';

import { timeframe$, setWindowSize } from 'in-components/timeline/timelineStore';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { slices } from 'in-components/timeline/timelineConfig';
import { timeframeShape } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimelineNavigation.less';

function getIndexOfSlice(time) {
  for (let i = 0; i < slices.length; ++i) {
    if (slices[i] >= time) {
      return i;
    }
  }
  return -1;
}

const block = 'in-timeline-navigation';

export default connectTo(
  {
    timeframe: timeframe$
  },
  class extends React.PureComponent {
    static displayName = 'TimelineNavigation';

    static propTypes = {
      timeframe: timeframeShape
    };

    render() {
      const timeframe = this.props.timeframe;
      if (!timeframe) {
        return null;
      }

      let isValueInSlices = false;
      for (let i = 0, length = slices.length; i < length; i++) {
        if (slices[i] === timeframe.windowSize) {
          isValueInSlices = true;
          break;
        }
      }

      let slicesToShow = slices;
      if (!isValueInSlices) {
        slicesToShow = slices.slice(); // copy array
        slicesToShow.push(timeframe.windowSize);
        slicesToShow.sort((a, b) => a - b);
      }

      return (
        <div className={block}>
          <select className={`${block}__selection`} value={timeframe.windowSize} onChange={this.onZoomChanged}>
            {slicesToShow.map(timeWindow =>
              <option key={timeWindow} value={timeWindow}>{formatDurationAccurately(timeWindow, 60000, false)}</option>
            )}
          </select>
        </div>
      );
    }

    onZoomChanged = e => {
      setWindowSize(e.target.value);
    };

    zoomOut = () => {
      const currentIndex = getIndexOfSlice(this.props.timeframe.windowSize);
      if (currentIndex < slices.length - 1) {
        setWindowSize(slices[currentIndex + 1]);
      }
    };

    zoomIn = () => {
      const currentIndex = getIndexOfSlice(this.props.timeframe.windowSize);
      if (currentIndex > 0) {
        setWindowSize(slices[currentIndex - 1]);
      }
    };
  }
);
