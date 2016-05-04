import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {setWindowSizeForSlider} from 'in-components/timeline/timelineStore';
import Slider from 'in-components/Slider';
import Icon from 'in-components/Icon';

import './TimelineNavigation.less';


const block = 'in-timeline-navigation';
const minZoomLevel = 1000 * 60 * 10; // 10 min
const maxZoomLevel = 1000 * 60 * 60 * 24 * 30; // 1 month (30 days)

export default React.createClass({

    displayName: 'TimelineNavigation',

    mixins: [
      PureRenderMixin
    ],

    render() {
      return (
        <div className={block}>
          <Icon type={'zoom_small'}
                className={block + '__icon-zoom'}/>
           <Slider onChange={this.onZoomChanged}
                   min={minZoomLevel}
                   max={maxZoomLevel}
                   defaultValue={maxZoomLevel}
                   step={(maxZoomLevel - minZoomLevel) / 20} // 20 steps
                   className={block + '__slider'}/>
          <Icon type={'zoom_large'}
                className={block + '__icon-zoom'}/>
        </div>
      );
    },

    onZoomChanged(e) {
      const newWindowSize = (maxZoomLevel - e.target.value) + minZoomLevel;
      setWindowSizeForSlider(newWindowSize);
    }
  });
