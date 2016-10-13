import React from 'react';

import EventDetailHeader from 'in-components/eventView/components/EventDetailHeader';
import EventTableHeader from 'in-components/eventView/components/EventTableHeader';
import {enable, disable} from 'in-components/eventView/stores/rawEventListStore';
import EventListHeader from 'in-components/eventView/components/EventListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import EventDetails from 'in-components/eventView/components/EventDetails';
import EventTable from 'in-components/eventView/components/EventTable';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';


export default React.createClass({
  displayName: 'EventView',

  propTypes: {
    children: React.PropTypes.any
  },

  componentWillMount() {
    enable();
  },

  componentWillUnmount() {
    disable();
  },

  render() {
    return (
      <div>
        <TwoColumnView leftContent={getLeftContent()}
                       rightContent={getRightContent()}
                       leftWidth='50rem' />

        {this.props.children}
      </div>
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
      <EventDetailHeader />
    </ViewHeader>,
    <EventDetails key='EventDetails' />
  ];
}
