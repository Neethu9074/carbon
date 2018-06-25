import React from 'react';

import ApplicationEntityOpenIssuesList from 'in-applications/components/ApplicationEntityHealthBadge/ApplicationEntityOpenIssuesList';
import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import HealthBadge from 'in-components/health/HealthBadge';
import { timeConfig$ } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ApplicationEntityHealthBadge.mless';

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
      openIssues: healthInfo$.map(healthInfo => healthInfo.openIssues.length),
      maxSeverity: healthInfo$.map(healthInfo => healthInfo.maxSeverity)
    };
  },
  function ApplicationEntityHealthBadge({ applicationId, serviceId, endpointId, openIssues, maxSeverity }) {
    const counter = (
      <Link href$={getEventsViewFilteredBy({ applicationId, serviceId, endpointId })} className={locals.link}>
        <HealthBadge openIssues={openIssues} maxSeverity={maxSeverity} />
      </Link>
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
