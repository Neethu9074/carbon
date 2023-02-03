/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import {
  applicationDashboard,
  applicationsList,
  endpointDashboard,
  newApplicationWaiterView,
  newServiceView,
  serviceDashboard,
  servicesList
} from 'in-applications/navigation/paths';
import CustomTime from 'in-components/time/TimeSelectionDialogPresenter/CustomTime';
import Releases from 'in-components/time/TimeSelectionDialogPresenter/Releases';
import Presets from 'in-components/time/TimeSelectionDialogPresenter/Presets';
import InlineTabNavigation from 'in-components/InlineTabNavigation';
import { isView } from 'in-stores/navigation/navigation';
import { analyze } from 'in-analyze/navigation/paths';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './TimeSelectionDialogPresenter.mless';

const tabList = [
  {
    icon: 'lib_datetime_timerange',
    text: t('in-components:time.timeSelectionDialogPresenterLabelTimeRange')
  },
  {
    icon: 'lib_release_rocket',
    text: t('in-components:time.timeSelectionDialogPresenterLabelReleases')
  }
];

export default connectTo(
  {
    isApp20View: isView(
      analyze,
      applicationsList,
      applicationDashboard,
      newApplicationWaiterView,
      servicesList,
      serviceDashboard,
      newServiceView,
      endpointDashboard
    )
  },
  function TimeSelectionDialogPresenter(props) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return (
      <section className={locals.wrapper}>
        <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={setActiveTabIndex} />

        {activeTabIndex == 0 ? (
          <>
            <Presets {...props} />
            <CustomTime {...props} />
          </>
        ) : (
          <Releases {...props} />
        )}
      </section>
    );
  }
);
