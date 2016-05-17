import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  timeframe$,
  setWindowSize,
  MIN_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL
} from 'in-components/timeline/timelineStore';
import {timeframeShape} from 'in-stores/timeline';
import Slider from 'in-components/Slider';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TimelineNavigation.less';

const MAX_ZOOM_LEVEL_FOR_SLIDER = Math.max(MAX_ZOOM_LEVEL, 1000 * 60 * 10);

const step = (MIN_ZOOM_LEVEL - MAX_ZOOM_LEVEL_FOR_SLIDER) / 30; // 30 steps
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

      return (
        <div className={block}>
          <Icon type={'zoom_small'}
                className={block + '__icon-zoom'}
                onClick={this.zoomOut}/>

          {/* MIN / MAX is turned upside down 'cause highest zoom level = smallest number */}
          <Slider onChange={this.onZoomChanged}
                  min={MAX_ZOOM_LEVEL_FOR_SLIDER}
                  max={MIN_ZOOM_LEVEL}
                  step={step}
                  defaultValue={MAX_ZOOM_LEVEL_FOR_SLIDER + MIN_ZOOM_LEVEL - timeframe.windowSize}
                  value={MAX_ZOOM_LEVEL_FOR_SLIDER + MIN_ZOOM_LEVEL - timeframe.windowSize}
                  className={block + '__slider'}/>

          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}
                onClick={this.zoomIn}/>
        </div>
      );
    },

    onZoomChanged(e) {
      setWindowSize(MAX_ZOOM_LEVEL_FOR_SLIDER + MIN_ZOOM_LEVEL - parseInt(e.target.value * 1, 10));
    },

    zoomOut() {
      setWindowSize(this.props.timeframe.windowSize + step);
    },

    zoomIn() {
      setWindowSize(this.props.timeframe.windowSize - step);
    }
  })
);
