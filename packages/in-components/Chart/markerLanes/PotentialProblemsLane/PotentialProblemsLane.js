import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemsPresenter from 'in-components/Chart/markerLanes/PotentialProblemsLane/PotentialProblemsLanePresenter';
import { emptyObject, pendingResult } from 'in-services/fixedObjects';
import getPotentialProblems from './getPotentialProblems';
import useObservable from 'in-hooks/useObservable';

export default function PotentialProblemsLane({ applicationId, serviceId, endpointId, alertRules, ...remainingProps }) {
  const { clusterSizeMillis } = remainingProps;

  const potentialProblems =
    useObservable(
      getPotentialProblems({
        timeConfig: remainingProps.timeConfig,
        alertRules,
        tagFilters: getTagfilters({ applicationId, serviceId, endpointId }),
        resultGranularity: clusterSizeMillis
      })
        .startWith(pendingResult)
        .map(({ data = {} }) => data),
      [remainingProps.timeConfig, clusterSizeMillis, alertRules]
    ) ?? emptyObject;

  return <PotentialProblemsPresenter {...remainingProps} potentialProblems={potentialProblems} />;
}

function getTagfilters({ applicationId, serviceId, endpointId }) {
  const internalTagFilters = [
    {
      name: 'application.id',
      operator: 'EQUALS',
      stringValue: applicationId
    }
  ];

  if (serviceId) {
    internalTagFilters.push({
      name: 'service.id',
      operator: 'EQUALS',
      stringValue: serviceId
    });
  }

  if (endpointId) {
    internalTagFilters.push({
      name: 'endpoint.id',
      operator: 'EQUALS',
      stringValue: endpointId
    });
  }

  return internalTagFilters;
}

PotentialProblemsLane.propTypes = {
  alertRules: PropTypes.object,
  applicationId: PropTypes.string,
  endpointId: PropTypes.string,
  serviceId: PropTypes.string
};
