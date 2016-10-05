import React from 'react';

import EntityInformation from 'in-components/eventView/components/eventDetails/EntityInformation';
import EventDuration from 'in-components/eventView/components/eventDetails/EventDuration';
import EventIcon from 'in-components/EventIcon/EventIcon';
import {formatTime} from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';

import './Header.less';


const block = 'in-event-view-event-details-header';
const flexWrapperClass = `${block}__flex-wrapper`;

export default function EventDetailsHeader({event, isCollapsed, onClick}) {
  let className = `${block}`;
  if (isCollapsed) {
    className += ` ${className}--collapsed`;
  }

  return (
    <div className={className}
         onClick={onClick}>

      <div className={flexWrapperClass}>
        <EventIcon event={event}
                   className={`${block}__icon`} />

        <div>
          <div className={flexWrapperClass}>
            <span className={`${block}__title`}>
              {event.get('title')}
            </span>
            <EventDuration event={event} />
            {event.get('state') === 'open'
              ? null
              : <span className={`${block}__end`}>
                  {`(${formatTime(event.get('end'))})`}
                </span>
            }
          </div>
          <EntityInformation event={event} />
        </div>
      </div>

      <SvgIcon type={isCollapsed ? 'plus_without_frame' : 'minus'}
               width={10}
               height={10}
               color='#7b8e96' />
    </div>
  );
}
