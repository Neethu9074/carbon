import React from 'react';

import { eventFilter$, setEventTypeFilter } from 'in-views/eventView/stores/eventFilterStore';
import { toggleAutoUpdate, autoUpdate$ } from 'in-views/eventView/stores/autoUpdate';
import { expandedSide$, toggleLeft } from 'in-views/eventView/stores/expandedSide';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import { refresh } from 'in-views/eventView/stores/rawEventListStore';
import { objectivesEnabled } from 'in-services/featureFlags';
import AutoUpdate from 'in-components/AutoUpdate';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './EventListHeader.less';

const block = 'in-event-view-event-list-header';

export default connectTo(
  {
    expandedSide: expandedSide$
  },
  function EventListHeader({ expandedSide }) {
    return (
      <ViewHeader className={block}>
        <div className={`${block}__left-side`}>
          <EventFilter>
            All
          </EventFilter>
          <EventFilter filter="incident">
            Incidents
          </EventFilter>
          <EventFilter filter="issue">
            Issues
          </EventFilter>
          <EventFilter filter="change">
            Changes
          </EventFilter>
          {objectivesEnabled
            ? <EventFilter filter="objectiveViolation">
                Objective violations
              </EventFilter>
            : null}
        </div>
        <div className={`${block}__right-side`}>
          <SvgIcon className={`${block}__refresh`} type="refresh" onClick={refresh} height={15} />
          <AutoUpdate
            checkboxId="event-view-auto-update"
            autoUpdate$={autoUpdate$}
            toggleAutoUpdate={toggleAutoUpdate}
          />
          <SvgIcon
            type={expandedSide === 'left' ? 'minimize' : 'maximize'}
            onClick={toggleLeft}
            height={14}
            className={`${block}__toggle-left`}
          />
        </div>
      </ViewHeader>
    );
  }
);

const EventFilter = connectTo(
  {
    eventFilter: eventFilter$
  },
  function EventFilter({ eventFilter, children, filter }) {
    let className = `${block}__title`;
    if ((filter && eventFilter === filter) || (!eventFilter && !filter)) {
      className += ` ${className}--selected`;
    }

    return (
      <div className={className} onClick={() => setEventTypeFilter(filter)}>
        {children}
      </div>
    );
  }
);
