import React from 'react';

import ApplicationEntityOpenIssuesList from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior/ApplicationEntityOpenIssuesList';
import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { timeConfig$ } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip';
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
  function ApplicationEntityHealthIndicatorBehavior({
    applicationId,
    serviceId,
    endpointId,
    openIssues,
    maxSeverity,
    IndicatorPresenter
  }) {
    if (openIssues == null || openIssues < 1) {
      return null;
    }

    const counter = (
      <IndicatorPresenter
        openIssues={openIssues}
        maxSeverity={maxSeverity}
        href$={getEventsViewFilteredBy({ applicationId, serviceId, endpointId })}
      />
    );

    if (openIssues > 0) {
      return (
        <Tooltip
          content={
            <ApplicationEntityOpenIssuesList
              applicationId={applicationId}
              serviceId={serviceId}
              endpointId={endpointId}
            />
          }
        >
          {counter}
        </Tooltip>
      );
    }

    return counter;
  }
);
