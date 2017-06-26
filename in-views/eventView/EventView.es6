import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import FullscreenTwoColumnView from 'in-components/FullscreenTwoColumnView/FullscreenTwoColumnView';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import EventDetailHeader from 'in-views/eventView/components/EventDetailHeader';
import EventTableHeader from 'in-views/eventView/components/EventTableHeader';
import { enable, disable } from 'in-views/eventView/stores/rawEventListStore';
import EventListHeader from 'in-views/eventView/components/EventListHeader';
import EventDetails from 'in-views/eventView/components/EventDetails';
import { expandedSide$ } from 'in-views/eventView/stores/expandedSide';
import EventTable from 'in-views/eventView/components/EventTable';
import LifecycleObserver from 'in-components/LifecycleObserver';

export default function EventView() {
  return (
    <div>
      <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />

      <FullscreenTwoColumnView
        leftContent={getLeftContent()}
        rightContent={getRightContent()}
        leftWidth="50rem"
        expandedSide$={expandedSide$}
      />

      <DashboardNavigationRoute />
    </div>
  );
}

function getLeftContent() {
  return [
    <EventListHeader key="EventListHeader" />,
    <EventTableHeader key="EventTableHeader" />,
    <EventTable key="EventTable" />
  ];
}

function getRightContent() {
  return [
    <ViewHeader key="EventViewHeader">
      <EventDetailHeader />
    </ViewHeader>,
    <EventDetails key="EventDetails" />
  ];
}
