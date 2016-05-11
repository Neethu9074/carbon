import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {windowSizeForSlider$, setWindowSizeForSlider} from 'in-components/timeline/timelineStore';
import Slider from 'in-components/Slider';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TimelineNavigation.less';


const minZoomLevel = 1000 * 60 * 10; // 10 min
const maxZoomLevel = 1000 * 60 * 60 * 24 * 30; // 1 month (30 days)
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

      const step = (maxZoomLevel - minZoomLevel) / 100; // 20 steps

      return (
        <div className={block}>
          <Icon type={'zoom_small'}
                className={block + '__icon-zoom'}/>

          <Slider onChange={this.onZoomChanged}
                  min={minZoomLevel}
                  max={maxZoomLevel}
                  step={step}
                  value={windowSizeForSlider}
                  className={block + '__slider'}/>

          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}/>
        </div>
      );
    },

    onZoomChanged(e) {
      setWindowSizeForSlider(e.target.value * 1); // as number
    }
  })
);
