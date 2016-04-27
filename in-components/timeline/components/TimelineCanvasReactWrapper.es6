import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import './TimelineCanvasReactWrapper.less';


const block = 'in-bottom-timeline-canvas';

export default React.createClass({

  displayName: 'TimelineCanvasReactWrapper',

  mixins: [
    PureRenderMixin
  ],

  render() {
    return (
      <canvas className={block} />
    );
  }
});
