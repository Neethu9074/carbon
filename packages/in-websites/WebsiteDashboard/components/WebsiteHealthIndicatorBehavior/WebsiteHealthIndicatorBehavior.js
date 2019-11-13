import React from 'react';

import WebsiteOpenIssuesList from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteOpenIssuesList';
import getWebsiteHealthInfo from 'in-subscription/website/getWebsiteHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ websiteId, openIssues, maxSeverity, timeConfig }) => {
    // openIssues and maxSeverity may be provided externally in cases where this component is used in lists.
    if (openIssues != null && maxSeverity != null) {
      return {};
    }

    const healthInfo$ = getWebsiteHealthInfo({
      websiteId,
      timeConfig
    }).filter(healthInfo => healthInfo.data != null);

    return {
      openIssues: healthInfo$.map(result => result.data.openIssues.length),
      maxSeverity: healthInfo$.map(result => result.data.maxSeverity),
      timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
    };
  },
  function WebsiteHealthIndicatorBehavior(props) {
    const { openIssues, showOkayOnNoIssues = true } = props;
    if (openIssues == null || openIssues < 0) {
      return null;
    }

    if (openIssues === 0) {
      return showOkayOnNoIssues ? <props.IndicatorPresenter openIssues={openIssues} /> : null;
    }

    return (
      <Overlay props={props} content={Content} withoutWrapper inContentArea={props.inContentArea}>
        {Indicator}
      </Overlay>
    );
  }
);

function Indicator({ openIssues, maxSeverity, IndicatorPresenter, refSetter, toggle }) {
  return (
    <IndicatorPresenter openIssues={openIssues} maxSeverity={maxSeverity} onClick={toggle} refSetter={refSetter} />
  );
}

function Content(props) {
  return <WebsiteOpenIssuesList {...props} />;
}
