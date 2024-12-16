/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import MobileOpenIssuesList from 'in-mobile-apps/MobileAppDashboard/components/MobileHealthIndicatorBehavior/MobileOpenIssuesList';
import getMobileHealthInfo from 'in-mobile-apps/subscriptions/getMobileHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';

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
      openIssues: healthInfo$.map(result => result.data.openIssues.length),
      maxSeverity: healthInfo$.map(result => result.data.maxSeverity),
      timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
    };
  },
  function MobileHealthIndicatorBehavior(props) {
    const { openIssues, maxSeverity, render, healthInfo } = props;

    if (render) {
      return render(healthInfo);
    }

    if (openIssues == null || openIssues < 0) {
      return null;
    }

    if (openIssues === 0) {
      return <props.IndicatorPresenter showCheckAsNeutral maxSeverity={maxSeverity} openIssues={openIssues} />;
    }

    return (
      <Overlay props={props} content={Content} withoutWrapper inContentArea={props.inContentArea} align="leftTop">
        {({ toggle, refSetter, isOpen }) => (
          <props.IndicatorPresenter
            openIssues={openIssues}
            maxSeverity={maxSeverity}
            onClick={toggle}
            refSetter={refSetter}
            isOpen={isOpen}
          />
        )}
      </Overlay>
    );
  }
);

function Content(props) {
  return <MobileOpenIssuesList {...props} />;
}
