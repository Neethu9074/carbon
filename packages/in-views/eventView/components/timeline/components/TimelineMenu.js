import React from 'react';

import TimelineLiveIndicator from 'in-views/eventView/components/timeline/components/TimelineLiveIndicator';
import TimelineMenuEventLine from 'in-views/eventView/components/timeline/components/TimelineMenuEventLine';
import { isCollapsed$, toggleMenu } from 'in-components/timeline/timelineStore';
import { eventsInTimeframe$ } from 'in-stores/eventsInTimeframe';
import { getSetting$, toggleIn } from 'in-services/settings';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TimelineMenu.less';

const block = 'in-events-timeline-menu';

export default connectTo(
  {
    events: eventsInTimeframe$,
    isCollapsed: isCollapsed$,
    autoCollapseTimeline: getSetting$('autoCollapseTimeline')
  },
  function TimelineMenu({ events, isCollapsed, autoCollapseTimeline }) {
    return (
      <div className={block}>
        <Tooltip content={autoCollapseTimeline ? 'Always show timeline.' : 'Automatically hide timeline.'}>
          <SvgIcon
            className={`${block}__toggle-auto-expand`}
            type={autoCollapseTimeline ? 'unpin' : 'pinned'}
            size="s"
            onClick={() => toggleIn('autoCollapseTimeline')}
          />
        </Tooltip>

        <div className={block + '__heading'} />

        <TimelineMenuEventLine
          title={'Incidents'}
          count={events ? events.incidents.length : 0}
          additionalContent={
            <div>
              <SvgIcon
                className={block + '__icon'}
                type={'timeline_' + (isCollapsed ? 'open' : 'close')}
                size="s"
                color="#80939c"
                onClick={toggleMenu}
              />
              <TimelineLiveIndicator />
            </div>
          }
        />

        <TimelineMenuEventLine title={'Issues'} count={events ? events.issues.length : 0} />

        <TimelineMenuEventLine title={'Changes'} count={events ? events.changes.length : 0} />
      </div>
    );
  }
);
