import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  windowSizeForSlider$,
  setWindowSizeForSlider,
  MIN_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL
} from 'in-components/timeline/timelineStore';
import Slider from 'in-components/Slider';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TimelineNavigation.less';


const step = (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / 100; // 100 steps

const block = 'in-timeline-navigation';
const rpt = React.PropTypes;

export default connectTo({
    windowSizeForSlider: windowSizeForSlider$
  }, React.createClass({

    displayName: 'TimelineNavigation',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      windowSizeForSlider: rpt.number
    },

    render() {
      const windowSizeForSlider = this.props.windowSizeForSlider;
      if (!windowSizeForSlider) {
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
                  value={MAX_ZOOM_LEVEL - windowSizeForSlider}
                  className={block + '__slider'}/>

          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}
                onClick={this.zoomOut}/>
        </div>
      );
    },

    onZoomChanged(e) {
      setWindowSizeForSlider(e.target.value * 1); // as number
    },

    zoomOut() {
      setWindowSizeForSlider(this.props.windowSizeForSlider + step);
    },

    zoomIn() {
      setWindowSizeForSlider(this.props.windowSizeForSlider - step);
    }
  })
);
