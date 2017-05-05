import React from 'react';

import classnames from 'in-services/util/classnames';
import { getSetting$ } from 'in-services/settings';
import { live$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimelineLiveIndicator.less';

const block = 'in-timeline-live-indicator';

export default connectTo(
  {
    live: live$,
    autoCollapseTimeline: getSetting$('autoCollapseTimeline')
  },
  function TimelineLiveIndicator({ autoCollapseTimeline, live }) {
    if (!autoCollapseTimeline) {
      return null;
    }

    return (
      <div
        className={classnames({
          [block]: true,
          [`${block}--live`]: live
        })}
      />
    );
  }
);
