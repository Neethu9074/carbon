import React from 'react';

import TimelineConfigureButton from 'in-components/timeline/components/TimelineConfigureButton';
import TimelineLiveIndicator from 'in-components/timeline/components/TimelineLiveIndicator';
import TimelineMenuEventLine from 'in-components/timeline/components/TimelineMenuEventLine';
import TimelineLiveButton from 'in-components/timeline/components/TimelineLiveButton';
import { isCollapsed$, toggleMenu } from 'in-components/timeline/timelineStore';
import { getIn, toggleIn } from 'in-services/settings';
import { eventsInTimeframe$ } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TimelineMenu.less';

const block = 'in-timeline-menu';

export default connectTo(
  {
    events: eventsInTimeframe$,
    isCollapsed: isCollapsed$,
    autoCollapseTimeline: getIn(['autoCollapseTimeline'])
  },
  function TimelineMenu({ events, isCollapsed, autoCollapseTimeline }) {
    return (
      <div className={block}>
        <Tooltip content={autoCollapseTimeline ? 'Always show timeline.' : 'Automatically hide timeline.'}>
          <SvgIcon
            type={autoCollapseTimeline ? 'unpin' : 'pinned'}
            width={12}
            className={`${block}__toggle-auto-expand`}
            onClick={() => toggleIn(['autoCollapseTimeline'])}
          />
        </Tooltip>

        <div className={block + '__heading'}>
          <TimelineConfigureButton />
          <TimelineLiveButton />
        </div>

        <TimelineMenuEventLine
          title={'Incidents'}
          count={events ? events.incidents.length : 0}
          additionalContent={
            <div>
              <SvgIcon
                className={block + '__icon'}
                type={'timeline_' + (isCollapsed ? 'open' : 'close')}
                width={19}
                height={19}
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
