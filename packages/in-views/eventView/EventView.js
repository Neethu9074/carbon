import { Switch, Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import { enable, disable } from 'in-views/eventView/stores/rawEventListStore';
import { expandedSide$ } from 'in-views/eventView/stores/expandedSide';
import Timeline from 'in-views/eventView/components/timeline/Timeline';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import EventDetails from 'in-views/eventView/components/EventDetails';
import EventTable from 'in-views/eventView/components/EventTable';
import LifecycleObserver from 'in-components/LifecycleObserver';
import ViewSwitcher from 'in-views/eventView/ViewSwitcher';
import ErrorBoundary from 'in-components/ErrorBoundary';
import SearchBar from 'in-components/SearchBar';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';

import './EventView.less';

const block = 'in-event-view';

const leftContent = <HeightRestrictedView render={() => <EventTable />} />;
const rightContent = <HeightRestrictedView render={() => <EventDetails />} />;

export default function EventView() {
  return (
    <Switch>
      {DashboardNavigationRoute}

      <Route path="/*" component={EventViewInternal} />
    </Switch>
  );
}

function EventViewInternal() {
  return (
    <Fragment>
      <Sticky header={<SearchBar />}>
        <Title title="Events" />
        <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />

        <Sticky header={<ViewSwitcher darkTheme />}>
          <div className={block}>
            <TwoColumnView
              leftContent={leftContent}
              rightContent={rightContent}
              leftWidth="46rem"
              expandedSide$={expandedSide$}
            />
          </div>
        </Sticky>
      </Sticky>
      <ErrorBoundary name="events-timeline">
        <Timeline />
      </ErrorBoundary>
    </Fragment>
  );
}
