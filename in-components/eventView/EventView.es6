import React from 'react';

import EventTableHeader from 'in-components/eventView/components/EventTableHeader';
import EventListHeader from 'in-components/eventView/components/EventListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import DetailPanel from 'in-components/eventView/components/DetailPanel';
import EventTable from 'in-components/eventView/components/EventTable';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';


export default function EventView() {
  return (
    <TwoColumnView leftContent={getLeftContent()}
                   rightContent={getRightContent()} />
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
    <ViewHeader key='EventViewHeader' />,
    <DetailPanel key='DetailPanel' />
  ];
}
