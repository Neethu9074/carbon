import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  timeframe$,
  setWindowSize
} from 'in-components/timeline/timelineStore';
import {formatDurationAccurately} from 'in-services/formatters/date';
import {slices} from 'in-components/timeline/timelineConfig';
import {timeframeShape} from 'in-stores/timeline';
import Tooltip from 'in-components/Tooltip';
import Slider from 'in-components/Slider';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

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


export default connectTo({
    timeframe: timeframe$
  }, React.createClass({

    displayName: 'TimelineNavigation',

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
      const value = slices.length - getIndexOfSlice(timeframe.windowSize) - 1;
      return (
        <div className={block}>
          <Icon type={'zoom_small'}
                className={block + '__icon-zoom'}
                onClick={this.zoomOut} />
          <Slider onChange={this.onZoomChanged}
                  min={0}
                  max={slices.length - 1}
                  step={1}
                  value={value}
                  className={block + '__slider'} />

          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}
                onClick={this.zoomIn} />

          <Tooltip content='Selected time window size'>
            <div className={`${block}__window-size`}>
              {formatDurationAccurately(timeframe.windowSize)}
            </div>
          </Tooltip>
        </div>
      );
    },

    onZoomChanged(e) {
      setWindowSize(slices[slices.length - e.target.value - 1]);
    },

    zoomOut() {
      const currentIndex = getIndexOfSlice(this.props.timeframe.windowSize);
      if (currentIndex < (slices.length - 1)) {
        setWindowSize(slices[currentIndex + 1]);
      }
    },

    zoomIn() {
      const currentIndex = getIndexOfSlice(this.props.timeframe.windowSize);
      if (currentIndex > 0) {
        setWindowSize(slices[currentIndex - 1]);
      }
    }
  })
);
