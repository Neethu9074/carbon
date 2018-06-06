import React from 'react';

import TimelineCanvasReactWrapper from 'in-views/eventView/components/timeline/components/TimelineCanvasReactWrapper';
import TimelineNavigation from 'in-views/eventView/components/timeline/components/TimelineNavigation';
import TimelineMenu from 'in-views/eventView/components/timeline/components/TimelineMenu';
import EventTooltip from 'in-views/eventView/components/timeline/components/EventTooltip';
import { isCollapsed$ } from 'in-components/timeline/timelineStore';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getSetting$ } from 'in-services/settings';
import connectTo from 'in-hoc/connectTo';

import './Timeline.less';

const block = 'in-events-timeline';

export default connectTo(
  {
    isCollapsed: isCollapsed$,
    autoCollapseTimeline: getSetting$('autoCollapseTimeline')
  },
  function Timeline({ isCollapsed, autoCollapseTimeline }) {
    return (
      <div className={`${block}__wrapper`}>
        <EventTooltip />

        <div
          className={evaluateClassNames({
            [block]: true,
            [`${block}--expanded`]: !isCollapsed,
            [`${block}--no-auto-collapse`]: !autoCollapseTimeline
          })}
        >
          <div className={`${block}__menu`}>
            <TimelineMenu />
            <TimelineCanvasReactWrapper />
          </div>
          <div className={block + '__bottom'}>
            <TimelineNavigation />
          </div>
        </div>
      </div>
    );
  }
);
