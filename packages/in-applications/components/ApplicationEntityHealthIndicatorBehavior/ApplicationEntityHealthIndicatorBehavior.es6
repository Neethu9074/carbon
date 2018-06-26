import React from 'react';

import ApplicationEntityOpenIssuesList from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityOpenIssuesList';
import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
// import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import Overlay from 'in-new-components/overlays/Overlay';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, openIssues, maxSeverity }) => {
    // openIssues and maxSeverity may be provided externally in cases where this component is used in
    // lists.
    if (openIssues != null && maxSeverity != null) {
      return {};
    }

    const healthInfo$ = timeConfig$
      .flatMap(timeConfig =>
        getApplicationEntityHealthInfo({
          applicationId,
          serviceId,
          endpointId,
          timeConfig
        })
      )
      .filter(healthInfo => healthInfo.data != null);

    return {
      openIssues: healthInfo$.map(healthInfo => healthInfo.data.openIssues.length),
      maxSeverity: healthInfo$.map(healthInfo => healthInfo.data.maxSeverity)
    };
  },
  function ApplicationEntityHealthIndicatorBehavior(props) {
    const { openIssues } = props;
    if (openIssues == null || openIssues < 1) {
      return null;
    }

    return (
      <Overlay props={props} content={Content} withoutWrapper>
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

function Content({ applicationId, serviceId, endpointId }) {
  return (
    <ApplicationEntityOpenIssuesList applicationId={applicationId} serviceId={serviceId} endpointId={endpointId} />
  );
}
