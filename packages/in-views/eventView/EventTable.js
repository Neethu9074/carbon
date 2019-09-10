import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { findIndex } from 'lodash';

import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import { rawEventList$, furtherDataAvailable$ } from 'in-views/eventView/stores/rawEventListStore';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import EventsNavigator from 'in-views/eventView/EventsNavigator';
import EventDetails from 'in-views/eventView/EventDetails';
import withUrlState from 'in-hoc/withUrlState';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/events',
        name: 'eventId'
      }
    ],
    reducerName: 'onChange'
  }),
  connectTo({ rawEventList: rawEventList$, furtherDataAvailable: furtherDataAvailable$ })
)(EventTable);

function EventTable(props) {
  const { rawEventList, eventId, items, onChange } = props;
  return (
    <Fragment>
      <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
        <NavigatorSplitScreen
          {...props}
          items={rawEventList}
          navigator={<EventsNavigator eventId={eventId} rawEventList={rawEventList} onChange={onChange} />}
          typeLabel="event"
          openItemIndex={findIndex(items, item => item.event.id === eventId)}
          openItem={e => {
            onChange({
              eventId: e.event.id
            });
          }}
        >
          <EventDetails
            eventId={eventId}
            openItem={eventId => {
              onChange({
                eventId
              });
            }}
          />
        </NavigatorSplitScreen>
      </Sticky>
    </Fragment>
  );
}
