import React from 'react';

import ApplicationEntityOpenIssuesList from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityOpenIssuesList';
import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import Overlay from 'in-new-components/overlays/Overlay';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, openIssues, maxSeverity, timeConfig }) => {
    // openIssues and maxSeverity may be provided externally in cases where this component is used in lists.
    if (openIssues != null && maxSeverity != null) {
      return {};
    }

    const healthInfo$ = getApplicationEntityHealthInfo({
      applicationId,
      serviceId,
      endpointId,
      timeConfig
    }).filter(healthInfo => healthInfo.data != null);

    return {
      openIssues: healthInfo$.map(result => result.data.openIssues.length),
      maxSeverity: healthInfo$.map(result => result.data.maxSeverity),
      timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
    };
  },
  function ApplicationEntityHealthIndicatorBehavior(props) {
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
  return <ApplicationEntityOpenIssuesList {...props} />;
}
