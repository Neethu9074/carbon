import React from 'react';

import { expandedSide$, toggleRight } from 'in-views/eventView/stores/expandedSide';
import { selectedEvent$ } from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './EventDetailHeader.less';

const block = 'in-event-view-event-detail-header';

export default connectTo(
  {
    expandedSide: expandedSide$,
    event: selectedEvent$
  },
  function EventDetailHeader({ event, expandedSide }) {
    if (!event) {
      return null;
    }

    return (
      <div className={block}>
        <SvgIcon
          type={expandedSide === 'right' ? 'minimize' : 'maximize'}
          onClick={toggleRight}
          height={14}
          className={`${block}__toggle-right`}
        />
      </div>
    );
  }
);
