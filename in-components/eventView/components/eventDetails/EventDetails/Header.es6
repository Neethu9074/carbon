import React from 'react';

import EntityInformation from 'in-components/eventView/components/eventDetails/EntityInformation';
import EventDuration from 'in-components/eventView/components/eventDetails/EventDuration';
import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import EventIcon from 'in-components/EventIcon/EventIcon';
import {formatTime} from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './Header.less';


const block = 'in-event-view-event-details-header';
const flexWrapperClass = `${block}__flex-wrapper`;

export default connectTo(props => {
  return {
    end: fireCallbacksForEventAtFocusedMomentAsStream(props.event,
      ({focusedMoment}) => focusedMoment ? props.event.get('end') : null,
      () => props.event.get('end'))
  };
},
function EventDetailsHeader({event, end, isCollapsed, isCollapsable, onClick}) {
  let className = `${block}`;
  if (isCollapsed) {
    className += ` ${className}--collapsed`;
  }

  if (isCollapsable) {
    className += ` ${block}__collapsable`;
    return (
      <div className={className}
           onClick={onClick}>

        <EventDescription event={event} end={end} />

        <SvgIcon type={isCollapsed ? 'plus_without_frame' : 'minus'}
                 width={10}
                 height={10}
                 color='#7b8e96' />
      </div>
    );
  }

  return (
    <div className={className}>
      <EventDescription event={event} end={end} />
    </div>
  );
});

function EventDescription({event, end}) {
  return (
    <div className={flexWrapperClass}>
      <EventIcon event={event}
                 className={`${block}__icon`} />

      <div>
        <div className={flexWrapperClass}>
          <span className={`${block}__title`}>
            {event.get('title')}
          </span>
          <EventDuration event={event} />
          {end
            ? <span className={`${block}__end`}>
                {`(${formatTime(end)})`}
              </span>
            : null
          }
        </div>
        <EntityInformation event={event} />
      </div>
    </div>
  );
}
