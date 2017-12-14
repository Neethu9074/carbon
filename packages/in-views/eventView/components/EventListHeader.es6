import React from 'react';

import { setEventTypeFilter, eventFilter$ } from 'in-views/eventView/stores/eventFilterStore';
import { toggleAutoUpdate, autoUpdate$ } from 'in-views/eventView/stores/autoUpdate';
import { refresh } from 'in-views/eventView/stores/rawEventListStore';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './EventListHeader.less';

const block = 'in-event-view-event-list-header';

export default connectTo(
  {
    activeFilter: eventFilter$
  },
  function EventListHeader({ activeFilter }) {
    return (
      <div className={block}>
        <div className={`${block}__left-side`}>
          <EventFilter activeFilter={activeFilter}>All</EventFilter>
          <EventFilter activeFilter={activeFilter} filter="incident">
            Incidents
          </EventFilter>
          <EventFilter activeFilter={activeFilter} filter="issue">
            Issues
          </EventFilter>
          <EventFilter activeFilter={activeFilter} filter="change">
            Changes
          </EventFilter>
        </div>
        <div className={`${block}__right-side`}>
          <SvgIcon className={`${block}__refresh`} type="refresh" onClick={refresh} height={15} />
          <AutoUpdate
            checkboxId="event-view-auto-update"
            autoUpdate$={autoUpdate$}
            toggleAutoUpdate={toggleAutoUpdate}
          />
        </div>
      </div>
    );
  }
);

function EventFilter({ activeFilter, children, filter }) {
  let className = `${block}__title`;
  if ((filter && activeFilter === filter) || (!activeFilter && !filter)) {
    className += ` ${className}--selected`;
  }

  return (
    <div className={className} onClick={() => setEventTypeFilter(filter)}>
      {children}
    </div>
  );
}
