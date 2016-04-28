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
        <Icon type={'search'}
              className={block + '__icon-zoom-out'}/>
         <Slider onChange={this.onZoomChanged}
                 min={0}
                 max={1}
                 defaultValue={0.5}
                 className={block + '__slider'}/>
        <Icon type={'search'}
              className={block + '__icon-zoom-in'}/>
      </div>
    );
  },

  onZoomChanged(e) {
    console.log(e.target.value);
  }
});
