import React from 'react';

import './TimelineMenuEventLine.less';

const block = 'in-timeline-menu-event-line';

export default function TimelineMenuEventLine() {
  return (
    <div className={block}>
      {`${this.props.title} (${this.props.count})`}
      {this.props.additionalContent}
    </div>
  );
}
