/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
import CustomTime from 'in-new-components/time/TimeSelectionDialogPresenter/CustomTime';
import Releases from 'in-new-components/time/TimeSelectionDialogPresenter/Releases';
import Presets from 'in-new-components/time/TimeSelectionDialogPresenter/Presets';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import { isView } from 'in-stores/navigation/navigation';
import { analyze } from 'in-analyze/navigation/paths';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './TimeSelectionDialogPresenter.mless';

const tabList = [
  {
    icon: 'lib_datetime_timerange',
    text: t('in-new-components:time.timeSelectionDialogPresenterLabelTimeRange')
  },
  {
    icon: 'lib_release_rocket',
    text: t('in-new-components:time.timeSelectionDialogPresenterLabelReleases')
  }
];

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
        <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={setActiveTabIndex} />

        {activeTabIndex == 0 ? (
          <>
            <Presets {...props} containsHistoricData={containsHistoricData} />
            <CustomTime {...props} />
          </>
        ) : (
          <Releases {...props} />
        )}
      </section>
    );
  }
);
