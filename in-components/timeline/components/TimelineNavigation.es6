import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {parseLong} from 'in-services/formatters/string';
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

const stepCount = 15;
const step = (MIN_ZOOM_LEVEL - MAX_ZOOM_LEVEL) / stepCount;
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
                  min={MAX_ZOOM_LEVEL}
                  max={MIN_ZOOM_LEVEL}
                  step={step}
                  value={MAX_ZOOM_LEVEL + MIN_ZOOM_LEVEL - timeframe.windowSize}
                  className={block + '__slider'}/>

          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}
                onClick={this.zoomIn}/>
        </div>
      );
    },

    onZoomChanged(e) {
      setWindowSize(MAX_ZOOM_LEVEL + MIN_ZOOM_LEVEL - parseLong(e.target.value));
    },

    zoomOut() {
      setWindowSize(this.props.timeframe.windowSize + step);
    },

    zoomIn() {
      setWindowSize(this.props.timeframe.windowSize - step);
    }
  })
);
