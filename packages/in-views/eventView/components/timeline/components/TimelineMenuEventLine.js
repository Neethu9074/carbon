import React from 'react';

import './TimelineMenuEventLine.less';

const block = 'in-events-timeline-menu-event-line';

export default function TimelineMenuEventLine({ title, count, additionalContent }) {
  return (
    <div className={block}>
      {`${title} (${count})`}
      {additionalContent}
    </div>
  );
}
