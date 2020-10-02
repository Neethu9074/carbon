import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemsLanePresenter from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import getPotentialProblems from 'in-new-components/PotentialProblems/subscription/getPotentialProblems';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time';

const emptyPotentialProblems = {
  alerts: [],
  thresholds: {}
};

export default function PotentialProblemsLane({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  alertRules,
  ...remainingProps
}) {
  if (!applicationId || !applicationSmartAlertsEnabled) {
    return null;
  }

  const globalTimeConfig = useTimeConfig();
  if (isOutsideCallsShortTermStorage(globalTimeConfig)) return null;

  const { clusterSizeMillis } = remainingProps;
  const tagFilters = getTagfilters({ applicationId, serviceId, endpointId, boundaryScope });

  const potentialProblems =
    useObservable(
      getPotentialProblems({
        timeConfig: globalTimeConfig,
        alertRules,
        tagFilters
      })
        .startWith(pendingResult)
        .map(({ data = emptyPotentialProblems }) => data),
      [globalTimeConfig, clusterSizeMillis, alertRules]
    ) ?? emptyPotentialProblems;

  return (
    <PotentialProblemsLanePresenter
      {...remainingProps}
      {...useGetLabels(applicationId, serviceId, endpointId)}
      alertRules={alertRules}
      applicationId={applicationId}
      boundaryScope={boundaryScope}
      potentialProblems={potentialProblems}
      tagFilters={tagFilters}
    />
  );
}

function getTagfilters({ applicationId, serviceId, endpointId, boundaryScope }) {
  const tagFilters = [
    {
      name: boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
      operator: 'EQUALS',
      stringValue: applicationId
    }
  ];

  if (serviceId) {
    tagFilters.push({
      name: 'service.id',
      operator: 'EQUALS',
      stringValue: serviceId
    });
  }

  if (endpointId) {
    tagFilters.push({
      name: 'endpoint.id',
      operator: 'EQUALS',
      stringValue: endpointId
    });
  }

  return tagFilters;
}

function useGetLabels(applicationId, serviceId, endpointId) {
  let boundaryScope;
  let applicationLabel;
  let serviceLabel;
  let endpointLabel;

  if (applicationId) {
    boundaryScope = useObservable(
      getApplication({ id: applicationId }).map(({ data }) => data?.boundaryScope ?? null),
      [applicationId]
    );
    applicationLabel = useObservable(getApplication({ id: applicationId }).map(getLabel), [applicationId]);
  }

  if (serviceId) {
    serviceLabel = useObservable(getServiceLabel({ id: serviceId }).map(getLabel), [serviceId]);
  }

  if (endpointId) {
    endpointLabel = useObservable(getEndpointInfo({ id: endpointId }).map(getLabel), [endpointId]);
  }

  return { applicationLabel, serviceLabel, endpointLabel, boundaryScope };
}

function getLabel(result) {
  return result?.data?.label ?? null;
}

/* This function is implemented after the respective backend function.
   See: https://github.com/instana/backend/blob/c27424b3a0b64ea38169f102450c721292184e84/ui-backend/src/main/java/com/instana/ui/service/smartAlerts/application/ApplicationPotentialProblemsService.java#L86
*/
function isOutsideCallsShortTermStorage(globalTimeConfig) {
  const now = Date.now();
  const granularity = 600000;
  const to = globalTimeConfig.to ?? now;
  const windowSize = globalTimeConfig.windowSize;
  const originalFrom = to - windowSize;
  let adjustedFrom = originalFrom - (originalFrom % granularity);

  if (adjustedFrom < originalFrom) {
    // If the first bucket was shifted to the left, drop it, otherwise it might slip outside the
    // short term retention storage (7 days by default) for "last 7 days" time frame and thus force
    // usage of the less precise long term retention storage.
    adjustedFrom = adjustedFrom + granularity;
  }

  const shortTermCutoff = now - days.toMillis(7);
  return adjustedFrom < shortTermCutoff;
}

PotentialProblemsLane.propTypes = {
  alertRules: PropTypes.object,
  applicationId: PropTypes.string,
  boundaryScope: PropTypes.string,
  endpointId: PropTypes.string,
  serviceId: PropTypes.string
};
