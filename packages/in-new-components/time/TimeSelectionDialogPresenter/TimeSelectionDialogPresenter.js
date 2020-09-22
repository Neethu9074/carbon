import React, { useState } from 'react';

import {
  applicationsList,
  applicationDashboard,
  newApplicationView,
  newApplicationWaiterView,
  servicesList,
  serviceDashboard,
  newServiceView,
  endpointDashboard
} from 'in-applications/navigation/paths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import CustomTime from 'in-new-components/time/TimeSelectionDialogPresenter/CustomTime';
import Releases from 'in-new-components/time/TimeSelectionDialogPresenter/Releases';
import Presets from 'in-new-components/time/TimeSelectionDialogPresenter/Presets';
import { isView } from 'in-stores/navigation/navigation';
import { analyze } from 'in-analyze/navigation/paths';
import connectTo from 'in-hoc/connectTo';

import locals from './TimeSelectionDialogPresenter.mless';

export default connectTo(
  {
    isApp20View: isView(
      analyze,
      applicationsList,
      applicationDashboard,
      newApplicationView,
      newApplicationWaiterView,
      servicesList,
      serviceDashboard,
      newServiceView,
      endpointDashboard
    )
  },
  function TimeSelectionDialogPresenter(props) {
    const containsHistoricData = props.historicOrLargeDataResult?.containsHistoricData ?? props.containsHistoricData;
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return (
      <section className={locals.wrapper}>
        <SecondLevelNavigation className={locals.tabs}>
          <SecondLevelNavigationItem
            className={locals.tab}
            label="Time range"
            icon="lib_application"
            isActive={activeTabIndex === 0}
            onClick={() => setActiveTabIndex(0)}
          />
          <SecondLevelNavigationItem
            className={locals.tab}
            label="Releases"
            icon="lib_release_rocket"
            isActive={activeTabIndex === 1}
            onClick={() => setActiveTabIndex(1)}
          />
        </SecondLevelNavigation>
        {activeTabIndex == 0 ? (
          <>
            <Presets {...props} containsHistoricData={containsHistoricData} />
            <CustomTime {...props} containsHistoricData={containsHistoricData} />
          </>
        ) : (
          <Releases {...props} />
        )}
      </section>
    );
  }
);
