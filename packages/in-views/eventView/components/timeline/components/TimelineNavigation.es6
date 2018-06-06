import React from 'react';

import { timeConfig$, setWindowSize } from 'in-components/timeline/timelineStore';
import { slices } from 'in-views/eventView/components/timeline/timelineConfig';
import { formatDurationAccurately } from 'in-services/formatters/date';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Slider from 'in-components/Slider';
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

const block = 'in-events-timeline-navigation';

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  class extends React.PureComponent {
    static displayName = 'TimelineNavigation';

    render() {
      const timeConfig = this.props.timeConfig;
      if (!timeConfig) {
        return null;
      }
      const value = slices.length - getIndexOfSlice(timeConfig.windowSize) - 1;
      return (
        <div className={block}>
          <SvgIcon className={block + '__icon-zoom'} type="search" width={12} color="#6b8088" onClick={this.zoomOut} />
          <Slider
            onChange={this.onZoomChanged}
            min={0}
            max={slices.length - 1}
            step={1}
            value={value}
            className={block + '__slider'}
          />
          <SvgIcon className={block + '__icon-zoom'} type="search" width={16} color="#6b8088" onClick={this.zoomIn} />
          <Tooltip content="Selected time window size">
            <div className={`${block}__window-size`}>{formatDurationAccurately(timeConfig.windowSize)}</div>
          </Tooltip>
        </div>
      );
    }

    onZoomChanged = e => {
      setWindowSize(slices[slices.length - e.target.value - 1]);
    };

    zoomOut = () => {
      const currentIndex = getIndexOfSlice(this.props.timeConfig.windowSize);
      if (currentIndex < slices.length - 1) {
        setWindowSize(slices[currentIndex + 1]);
      }
    };

    zoomIn = () => {
      const currentIndex = getIndexOfSlice(this.props.timeConfig.windowSize);
      if (currentIndex > 0) {
        setWindowSize(slices[currentIndex - 1]);
      }
    };
  }
);
