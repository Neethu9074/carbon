import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import FullscreenTwoColumnView from 'in-components/FullscreenTwoColumnView/FullscreenTwoColumnView';
import ToggleViewHeader from 'in-components/TwoColumnView/components/ToggleViewHeader';
import { expandedSide$, toggleRight } from 'in-views/eventView/stores/expandedSide';
import { enable, disable } from 'in-views/eventView/stores/rawEventListStore';
import EventListHeader from 'in-views/eventView/components/EventListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import EventDetails from 'in-views/eventView/components/EventDetails';
import EventTable from 'in-views/eventView/components/EventTable';
import LifecycleObserver from 'in-components/LifecycleObserver';
import { clearSelectedEvent } from 'in-stores/navigation/view';
import Title from 'in-components/Title';

const leftContent = [<EventListHeader key="EventListHeader" />, <EventTable key="EventTable" />];

const rightContent = [
  <ViewHeader key="EventViewHeader">
    <ToggleViewHeader expandedSide$={expandedSide$} toggleRight={toggleRight} onClear={clearSelectedEvent} />
  </ViewHeader>,
  <EventDetails key="EventDetails" />
];

export default function EventView() {
  return (
    <div>
      <Title title="Events" />
      <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />

      <FullscreenTwoColumnView
        leftContent={leftContent}
        rightContent={rightContent}
        leftWidth="46rem"
        expandedSide$={expandedSide$}
      />

      {DashboardNavigationRoute}
    </div>
  );
}
