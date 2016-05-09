import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import createTimelineRenderer from 'in-components/timeline/components/timelineCanvas';

import './TimelineCanvasReactWrapper.less';


const block = 'in-timeline-canvas';

export default React.createClass({

  displayName: 'TimelineCanvasReactWrapper',

  mixins: [
    PureRenderMixin
  ],

  componentDidMount() {
    this.renderer = createTimelineRenderer({
      container: this.refs.container,
      canvas: this.refs.canvas
    });
  },

  componentWillUnmount() {
    this.renderer.dispose();
  },

  render() {
    return (
      <div ref='container'
           className={block}>
        <canvas ref='canvas'
                className={block + '__canvas'} />
      </div>
    );
  }
});
