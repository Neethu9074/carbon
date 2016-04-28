import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Slider from 'in-components/Slider';
import Icon from 'in-components/Icon';

import './TimelineNavigation.less';


const block = 'in-bottom-timeline-navigation';

export default React.createClass({

  displayName: 'TimelineNavigation',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
  },

  render() {
    return (
      <div className={block}>
        <Icon type={'zoom_small'}
              className={block + '__icon-zoom'}/>
         <Slider onChange={this.onZoomChanged}
                 min={0}
                 max={1}
                 defaultValue={0.5}
                 className={block + '__slider'}/>
        <Icon type={'zoom_large'}
              className={block + '__icon-zoom'}/>
      </div>
    );
  },

  onZoomChanged(e) {
    console.log(e.target.value);
  }
});
