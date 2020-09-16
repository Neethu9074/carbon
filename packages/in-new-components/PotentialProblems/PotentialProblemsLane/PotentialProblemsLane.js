import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemsPresenter from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import getPotentialProblems from 'in-new-components/PotentialProblems/subscription/getPotentialProblems';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getApplication from 'in-subscription/application/getApplication';
import { emptyObject, pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

export default function PotentialProblemsLane({ applicationId, serviceId, endpointId, alertRules, ...remainingProps }) {
  const { clusterSizeMillis } = remainingProps;
  const tagFilters = getTagfilters({ applicationId, serviceId, endpointId });

  const potentialProblems =
    useObservable(
      getPotentialProblems({
        timeConfig: remainingProps.timeConfig,
        alertRules,
        tagFilters,
        resultGranularity: clusterSizeMillis
      })
        .startWith(pendingResult)
        .map(({ data = {} }) => data),
      [remainingProps.timeConfig, clusterSizeMillis, alertRules]
    ) ?? emptyObject;

  return (
    <PotentialProblemsPresenter
      {...remainingProps}
      {...useGetLabels(applicationId, serviceId, endpointId)}
      applicationId={applicationId}
      potentialProblems={potentialProblems}
      tagFilters={tagFilters}
    />
  );
}

function getTagfilters({ applicationId, serviceId, endpointId }) {
  const tagFilters = [
    {
      name: 'application.id',
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

PotentialProblemsLane.propTypes = {
  alertRules: PropTypes.object,
  applicationId: PropTypes.string,
  endpointId: PropTypes.string,
  serviceId: PropTypes.string
};
