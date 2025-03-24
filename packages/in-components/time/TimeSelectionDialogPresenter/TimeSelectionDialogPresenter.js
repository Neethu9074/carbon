/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { CarbonLayer } from '@instana/components';

import CustomTime from 'in-components/time/TimeSelectionDialogPresenter/CustomTime';
import Releases from 'in-components/time/TimeSelectionDialogPresenter/Releases';
import Presets from 'in-components/time/TimeSelectionDialogPresenter/Presets';
import InlineTabNavigation from 'in-components/InlineTabNavigation';
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

export default function TimeSelectionDialogPresenter(props) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div className={locals.wrapper}>
      <InlineTabNavigation tabList={tabList} activeTabIndex={activeTabIndex} onTabSelect={setActiveTabIndex} />

      {activeTabIndex == 0 ? (
        <>
          <Presets {...props} />
          <CarbonLayer>
            <CustomTime {...props} />
          </CarbonLayer>
        </>
      ) : (
        <Releases {...props} />
      )}
    </div>
  );
}
