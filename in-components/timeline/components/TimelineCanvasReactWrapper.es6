import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import createTimelineRenderer from 'in-components/timeline/components/timelineCanvas';
import {mutateWithMouseEvents, disposeMouseEvents} from 'in-services/react';
import {setTo} from 'in-components/timeline/timelineStore';

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

    mutateWithMouseEvents(this.refs.container, this);
  },

  componentWillUnmount() {
    this.renderer.dispose();

    disposeMouseEvents(this.refs.container);
  },

  render() {
    return (
      <div ref='container'
           className={block}>
        <canvas ref='canvas'
                className={block + '__canvas'} />
      </div>
    );
  },

  onMouseDown() {},

  onMouseUp(/* x */) {
    // const timestamp = this.renderer.getDomain(x);
  },

  onDrag(x, prevX) {
    const oldTimestamp = this.renderer.getDomain(prevX);
    const newTimestamp = this.renderer.getDomain(x);
    setTo(newTimestamp, oldTimestamp);
  }
});
