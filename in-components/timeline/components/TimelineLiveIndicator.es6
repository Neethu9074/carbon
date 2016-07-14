import React from 'react';

import {isCollapsed$} from 'in-components/timeline/timelineStore';
import classnames from 'in-services/util/classnames';
import {getIn} from 'in-services/settings';
import {live$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimelineLiveIndicator.less';

const block = 'in-timeline-live-indicator';

export default connectTo({
    live: live$,
    isCollapsed: isCollapsed$,
    autoCollapseTimeline: getIn(['autoCollapseTimeline'])
  }, function TimelineLiveIndicator({autoCollapseTimeline, isCollapsed, live}) {
    if (!autoCollapseTimeline || !isCollapsed) {
      return null;
    }

    return (
      <div className={classnames({
             [block]: true,
             [`${block}--live`]: live
           })} />
    );
  }
);
