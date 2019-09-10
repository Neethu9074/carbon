import React, { Fragment } from 'react';
import { findIndex } from 'lodash';

import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import EventsNavigator from 'in-views/eventView/EventsNavigator';
import EventDetails from 'in-views/eventView/EventDetails';
import withUrlState from 'in-hoc/withUrlState';
import Sticky from 'in-components/Sticky';

export default withUrlState({
  bind: [
    {
      path: '/events',
      name: 'eventId'
    }
  ],
  reducerName: 'onChange'
})(EventTable);

function EventTable(props) {
  const { eventId, items, onChange } = props;
  return (
    <Fragment>
      <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
        <NavigatorSplitScreen
          {...props}
          items={[{ event: { id: '42' } }]}
          navigator={<EventsNavigator eventId={eventId} onChange={onChange} />}
          typeLabel="Lets find out"
          openItemIndex={findIndex(items, item => item.event.id === eventId)}
          openItem={e => {
            // triggerHighlight(getHighlighterId(e.event.id));
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
