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


const step = (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / 100; // 100 steps
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
                onClick={this.zoomIn}/>

          <Slider onChange={this.onZoomChanged}
                  min={MIN_ZOOM_LEVEL}
                  max={MAX_ZOOM_LEVEL}
                  step={step}
                  defaultValue={timeframe.windowSize}
                  value={timeframe.windowSize}
                  className={block + '__slider'}/>

          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}
                onClick={this.zoomOut}/>
        </div>
      );
    },

    onZoomChanged(e) {
      setWindowSize(e.target.value * 1); // as number
    },

    zoomOut() {
      setWindowSize(this.props.timeframe.windowSize + step);
    },

    zoomIn() {
      setWindowSize(this.props.timeframe.windowSize - step);
    }
  })
);
