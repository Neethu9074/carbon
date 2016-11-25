import React from 'react';

import TimelineLiveIndicator from 'in-components/timeline/components/TimelineLiveIndicator';
import TimelineMenuEventLine from 'in-components/timeline/components/TimelineMenuEventLine';
import TimelineSelectedTime from 'in-components/timeline/components/TimelineSelectedTime';
import TimelineLiveButton from 'in-components/timeline/components/TimelineLiveButton';
import {isCollapsed$, toggleMenu} from 'in-components/timeline/timelineStore';
import {getIn, toggleIn} from 'in-services/settings';
import {eventsInTimeframe$} from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TimelineMenu.less';

const block = 'in-timeline-menu';

export default connectTo({
  events: eventsInTimeframe$,
  isCollapsed: isCollapsed$,
  autoCollapseTimeline: getIn(['autoCollapseTimeline'])
}, function TimelineMenu({events, isCollapsed, autoCollapseTimeline}) {
return (
  <div className={block}>
    <Tooltip content={autoCollapseTimeline ? 'Always show timeline.' : 'Automatically hide timeline.'}>
      <SvgIcon type={autoCollapseTimeline ? 'unpin' : 'pinned'}
            width={autoCollapseTimeline ? 12 : 12}
            className={`${block}__toggle-auto-expand`}
            onClick={() => toggleIn(['autoCollapseTimeline'])}/>
    </Tooltip>

    <div className={block + '__heading'}>
      <TimelineSelectedTime/>
      <TimelineLiveButton/>
    </div>

    <TimelineMenuEventLine title={'Incidents'}
                           count={events ? events.incidents.length : 0}
                           additionalContent={
                             <div>
                               <Icon type={'timeline_' + (isCollapsed ? 'open' : 'close')}
                                     className={block + '__icon'}
                                     onClick={toggleMenu}/>
                               <TimelineLiveIndicator />
                             </div>
                           }/>

    <TimelineMenuEventLine title={'Issues'}
                           count={events ? events.issues.length : 0}/>

    <TimelineMenuEventLine title={'Changes'}
                           count={events ? events.changes.length : 0}/>
  </div>
);
});
