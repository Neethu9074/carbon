import React from 'react';

import TimelineMenuEventLine from 'in-components/timeline/components/TimelineMenuEventLine';
import TimelineSelectedTime from 'in-components/timeline/components/TimelineSelectedTime';
import TimelineLiveButton from 'in-components/timeline/components/TimelineLiveButton';
import {isCollapsed$, toggleMenu} from 'in-components/timeline/timelineStore';
import {eventsInTimeframe$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TimelineMenu.less';


const block = 'in-timeline-menu';
const rpt = React.PropTypes;

export default connectTo({
    events: eventsInTimeframe$,
    isCollapsed: isCollapsed$
  }, TimelineMenu
);

function TimelineMenu({events, isCollapsed}) {
  return (
    <div className={block}>
      <div className={block + '__heading'}>
        <TimelineSelectedTime/>
        <TimelineLiveButton/>
      </div>

      <TimelineMenuEventLine title={'Incidents'}
                             count={events ? events.incidents.length : 0}
                             additionalContent={
                               <Icon type={'timeline_' + (isCollapsed ? 'open' : 'close')}
                                     className={block + '__icon'}
                                     onClick={toggleMenu}/>
                             }/>

      <TimelineMenuEventLine title={'Issues'}
                             count={events ? events.issues.length : 0}/>

      <TimelineMenuEventLine title={'Changes'}
                             count={events ? events.changes.length : 0}/>
    </div>
  );
}

TimelineMenu.propTypes = {
  events: rpt.object,
  isCollapsed: rpt.bool
};
