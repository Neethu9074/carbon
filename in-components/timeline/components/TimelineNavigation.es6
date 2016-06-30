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
import TimeSlicer from './util/TimeSlicer';

// Time range constants
const days = 30;
const hours = 24;
const minutes = 6;
const steps = days + hours + minutes;

// Utilities
const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;

const slicer = new TimeSlicer({
  min: MAX_ZOOM_LEVEL,
  max: MIN_ZOOM_LEVEL
});

// Slice minutes (10mins-60mins)
slicer.slice(slicer.min, slicer.min + hour, minutes);
// Slice hours (1hour-24hours)
slicer.slice(slicer.min + hour, slicer.min + day, hours);
// Slice days (1day-30days)
slicer.slice(slicer.min + day, slicer.max, days);

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
      let value = steps - slicer.indexOf(timeframe.windowSize);
      if (value == null) {
        value = '';
      }
      return (
        <div className={block}>
          <Icon type={'zoom_small'}
                className={block + '__icon-zoom'}
                onClick={this.zoomOut}/>
          <Slider onChange={this.onZoomChanged}
                  min={0}
                  max={steps}
                  step={1}
                  value={value}
                  className={block + '__slider'}/>

          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}
                onClick={this.zoomIn}/>
        </div>
      );
    },

    onZoomChanged(e) {
      setWindowSize(slicer.get(steps - e.target.value));
    },

    zoomOut() {
      const currentIndex = slicer.indexOf(this.props.timeframe.windowSize);
      if (currentIndex < steps) {
        setWindowSize(slicer.get(currentIndex + 1));
      }
    },

    zoomIn() {
      const currentIndex = slicer.indexOf(this.props.timeframe.windowSize);
      if (currentIndex > 0) {
        setWindowSize(slicer.get(currentIndex - 1));
      }
    }
  })
);
