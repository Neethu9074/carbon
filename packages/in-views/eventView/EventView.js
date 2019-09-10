import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import { enable, disable } from 'in-views/eventView/stores/rawEventListStore';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import LifecycleObserver from 'in-components/LifecycleObserver';
import ViewSwitcher from 'in-views/eventView/ViewSwitcher';
import EventChart from 'in-views/eventView/EventChart';
import EventTable from 'in-views/eventView/EventTable';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

export default function EventView() {
  return (
    <Switch>
      {DashboardNavigationRoute}

      <Route path="/*" component={EventViewInternal} />
    </Switch>
  );
}

function EventViewInternal({ location }) {
  const eventType = getMatrixParameter(location, '/events', 'view');
  return (
    <>
      <Sticky header={<SearchBar />}>
        <Title title="Events" />
        <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />

        <Sticky header={<ViewSwitcher selectedEventType={eventType} darkTheme />}>
          <>
            <EventTable eventType={eventType} />
            <EventChart />
          </>
        </Sticky>
      </Sticky>
    </>
  );
}
