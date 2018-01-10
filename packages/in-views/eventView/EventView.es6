import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import { expandedSide$, toggleRight } from 'in-views/eventView/stores/expandedSide';
import { enable, disable } from 'in-views/eventView/stores/rawEventListStore';
import EventListHeader from 'in-views/eventView/components/EventListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import { clearSelectedEvent } from 'in-stores/navigation/paths/eventPaths';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import EventDetails from 'in-views/eventView/components/EventDetails';
import EventTable from 'in-views/eventView/components/EventTable';
import LifecycleObserver from 'in-components/LifecycleObserver';
import LegacyView from 'in-components/LegacyView';
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
    <Sticky header={<SearchBar />}>
      <LegacyView />
      <Title title="Events" />
      <LifecycleObserver onWillMount={enable} onWillUnmount={disable} />

      <Sticky
        header={
          <ViewHeader
            expandedSide$={expandedSide$}
            toggleRight={toggleRight}
            leftContent={<EventListHeader />}
            leftWidth="46rem"
            onClear={clearSelectedEvent}
          />
        }
      >
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
  );
}
