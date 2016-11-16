import React from 'react';

import EventDetailHeader from 'in-views/eventView/components/EventDetailHeader';
import EventTableHeader from 'in-views/eventView/components/EventTableHeader';
import {enable, disable} from 'in-views/eventView/stores/rawEventListStore';
import EventListHeader from 'in-views/eventView/components/EventListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import EventDetails from 'in-views/eventView/components/EventDetails';
import EventTable from 'in-views/eventView/components/EventTable';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import LifecycleObserver from 'in-components/LifecycleObserver';


export default function EventView({children}) {
  return (
    <div>
      <LifecycleObserver onWillMount={enable}
                         onWillUnmount={disable}/>

      <TwoColumnView leftContent={getLeftContent()}
                     rightContent={getRightContent()}
                     leftWidth='50rem' />

      {children}
    </div>
  );
}

function getLeftContent() {
  return [
    <EventListHeader key='EventListHeader' />,
    <EventTableHeader key='EventTableHeader' />,
    <EventTable key='EventTable' />
  ];
}

function getRightContent() {
  return [
    <ViewHeader key='EventViewHeader'>
      <EventDetailHeader />
    </ViewHeader>,
    <EventDetails key='EventDetails' />
  ];
}
