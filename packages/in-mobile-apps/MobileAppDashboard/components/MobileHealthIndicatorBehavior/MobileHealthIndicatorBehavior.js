/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import MobileOpenIssuesList from 'in-mobile-apps/MobileAppDashboard/components/MobileHealthIndicatorBehavior/MobileOpenIssuesList';
import GenericIndicatorPresenter from 'in-components/GenericIndicatorPresenter/GenericIndicatorPresenter';
import getMobileHealthInfo from 'in-mobile-apps/subscriptions/getMobileHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

function Content(props) {
  return <MobileOpenIssuesList {...props} />;
}

export default connectTo(
  ({ mobileAppId, openIssues, maxSeverity, timeConfig }) => {
    // openIssues and maxSeverity may be provided externally in cases where this component is used in lists.
    if (openIssues != null && maxSeverity != null) {
      return {};
    }

    const healthInfo$ = getMobileHealthInfo({
      mobileAppId,
      timeConfig
    }).filter(healthInfo => healthInfo.data != null);

    return {
      healthInfo: healthInfo$.map(result => result.data),
      openIssues: healthInfo$.map(result => result.data?.openIssues?.length ?? 0),
      maxSeverity: healthInfo$.map(result => result.data?.maxSeverity ?? 0),
      timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
    };
  },
  function MobileHealthIndicatorBehavior(props) {
    const { openIssues, maxSeverity, render, healthInfo, IndicatorPresenter, inContentArea } = props;

    if (render && healthInfo) {
      return render(healthInfo);
    }

    if (openIssues == null || openIssues < 0) {
      return null;
    }

    if (openIssues === 0) {
      return <IndicatorPresenter showCheckAsNeutral maxSeverity={maxSeverity} openIssues={openIssues} />;
    }

    return (
      <GenericIndicatorPresenter
        Content={Content}
        contentProps={{
          ...props,
          healthInfo
        }}
        IndicatorPresenter={IndicatorPresenter}
        indicatorProps={{
          openIssues: openIssues,
          maxSeverity: maxSeverity
        }}
        inContentArea={inContentArea}
      />
    );
  }
);
