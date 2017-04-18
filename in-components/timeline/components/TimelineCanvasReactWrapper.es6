import React from 'react';

import TimelineTimestamps from 'in-components/timeline/components/TimelineTimestamps';
import createTimelineRenderer from 'in-components/timeline/components/timelineCanvas';

import './TimelineCanvasReactWrapper.less';

const block = 'in-timeline-canvas';

export default class extends React.PureComponent {
  static displayName = 'TimelineCanvasReactWrapper';

  componentDidMount() {
    this.renderer = createTimelineRenderer({
      container: this.container,
      canvas: this.timelineCanvas,
      glassPane: this.glassPane
    });
  }

  componentWillUnmount() {
    this.renderer.dispose();
  }

  render() {
    return (
      <div ref={container => this.container = container} className={block}>
        <canvas ref={_canvas => this.timelineCanvas = _canvas} className={block + '__canvas'} />
        <div ref={glassPane => this.glassPane = glassPane} className={block + '__glasspane'} />
        <TimelineTimestamps />
      </div>
    );
  }
}
