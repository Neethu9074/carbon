import React from 'react';

import EventIconLabel from 'in-components/eventView/components/eventDetails/EventIconLabel';
import EventTableHeader from 'in-components/eventView/components/EventTableHeader';
import {enable, disable} from 'in-components/eventView/stores/shedEventListStore';
import EventListHeader from 'in-components/eventView/components/EventListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import DetailPanel from 'in-components/eventView/components/DetailPanel';
import EventTable from 'in-components/eventView/components/EventTable';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';


export default React.createClass({

  displayName: 'EventView',

  componentWillMount() {
    enable();
  },

  componentWillUnmount() {
    disable();
  },

  render() {
    return (
      <TwoColumnView leftContent={getLeftContent()}
                     rightContent={getRightContent()} />
    );
  }
});

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
      <EventIconLabel />
    </ViewHeader>,
    <DetailPanel key='DetailPanel' />
  ];
}
