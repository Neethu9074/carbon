import React from 'react';

import TimelineTimestamp from 'in-views/eventView/components/timeline/components/TimelineTimestamp';
import { to$, from$ } from 'in-components/timeline/timelineStore';
import getElementDimensions from 'in-hoc/getElementDimensions';
import connectTo from 'in-hoc/connectTo';

import './TimelineTimestamps.less';

const block = 'in-events-timeline-timestamps';

export default getElementDimensions(
  connectTo(
    {
      from: from$,
      to: to$
    },
    function TimelineTimestamps({ from, to }) {
      return (
        <div className={block}>
          <div className={`${block}__line ${block}__second`}>
            <TimelineTimestamp
              timestamp={from}
              type="dark"
              style={{
                left: 0
              }}
            />
            <TimelineTimestamp
              timestamp={to}
              type="dark"
              style={{
                right: 0
              }}
            />
          </div>
        </div>
      );
    }
  )
);
