/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';

import {
  getEntitySelection,
  getEntitySelectionAsTagFilterFormModel
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { isAlertQueryValid as isApplicationAlertQueryValid } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import PotentialProblemsLanePresenter from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import isOutsideCallsShortTermStorage from 'in-alerting/PotentialProblems/PotentialProblemsLane/isOutsideCallsShortTermStorage';
import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getPotentialProblems from 'in-alerting/PotentialProblems/subscription/getPotentialProblems';
import { trackRequestLoadingTime } from 'in-alerting/PotentialProblems/tracker';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';

const emptyPotentialProblems = {
  alerts: [],
  thresholds: {}
};

export default function PotentialProblemsLane({
  clusterSizeMillis,
  chartName,
  applicationId,
  serviceId,
  endpointId,
  ...props
}) {
  const globalTimeConfig = useTimeConfig();
  const labels = useGetLabels(applicationId, serviceId, endpointId);

  if (isOutsideCallsShortTermStorage(globalTimeConfig)) {
    return null;
  }

  if (
    (applicationId && !labels.applicationLabel) ||
    (serviceId && !labels.serviceLabel) ||
    (endpointId && !labels.endpointLabel)
  ) {
    // don't proceed when not all necessary labels are loaded, because otherwise we would request an additional
    // unnecessary potential problem with an incomplete scope
    return null;
  }

  if (!applicationId || !applicationSmartAlertsEnabled) {
    return null;
  }

  return (
    <PotentialProblemsLaneConnected
      {...props}
      applications={getEntitySelection(applicationId, serviceId, endpointId)}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      labels={labels}
      chartName={chartName}
      globalTimeConfig={globalTimeConfig}
      clusterSizeMillis={clusterSizeMillis}
    />
  );
}

function PotentialProblemsLaneConnected({
  boundaryScope,
  applicationId,
  includeSynthetic,
  applications,
  labels,
  alertRules,
  chartName,
  clusterSizeMillis,
  globalTimeConfig,
  ...remainingProps
}) {
  const startTime = useRef(null);
  const potentialProblemsResult = useObservable(
    ([_globalTimeConfig, _alertRules]) =>
      getPotentialProblemsObservable([
        _globalTimeConfig,
        _alertRules,
        includeSynthetic,
        applications,
        startTime,
        chartName,
        boundaryScope,
        applicationId
      ]),
    [globalTimeConfig, alertRules, clusterSizeMillis, includeSynthetic, applications]
  );

  return (
    <PotentialProblemsLanePresenter
      {...remainingProps}
      {...labels}
      alertRules={alertRules}
      applicationId={applicationId}
      boundaryScope={boundaryScope}
      includeSynthetic={includeSynthetic}
      potentialProblems={potentialProblemsResult?.data ?? emptyPotentialProblems}
      tagFilterExpression={EMPTY_EXPRESSION}
      applications={applications}
      isLoading={isLoading(potentialProblemsResult)}
      queryValidator={isApplicationAlertQueryValid}
    />
  );
}

function useGetLabels(applicationId, serviceId, endpointId) {
  return {
    applicationLabel: useObservable(getApplicationLabelObservable, [applicationId]),
    serviceLabel: useObservable(getServiceLabelObservable, [serviceId]),
    endpointLabel: useObservable(getEndpointLabelObservable, [endpointId])
  };
}

function getLabel(result) {
  return result?.data?.label ?? null;
}

PotentialProblemsLane.propTypes = {
  alertRules: PropTypes.object,
  applicationId: PropTypes.string,
  boundaryScope: PropTypes.string,
  endpointId: PropTypes.string,
  serviceId: PropTypes.string,
  clusterSizeMillis: PropTypes.number,
  chartName: PropTypes.string
};

function getApplicationLabelObservable([id]) {
  return id && getApplication({ id }).map(getLabel);
}

function getServiceLabelObservable([id]) {
  return id && getServiceLabel({ id }).map(getLabel);
}

function getEndpointLabelObservable([id]) {
  return id && getEndpointInfo({ id }).map(getLabel);
}

function getPotentialProblemsObservable([
  globalTimeConfig,
  alertRules,
  includeSynthetic,
  applications,
  startTime,
  chartName,
  boundaryScope,
  applicationId
]) {
  return getPotentialProblems({
    timeConfig: globalTimeConfig,
    alertRules,
    includeSynthetic,
    tagFilterExpression: toBackendQueryModel(
      getEntitySelectionAsTagFilterFormModel(applications, boundaryScope, applicationId)
    )
  })
    .startWith(pendingResult)
    .tap(result => {
      const start = startTime.current;
      if (isLoading(result) && !start) {
        startTime.current = Date.now();
      } else if (result.data && start) {
        if (result.data.alerts.length !== 0) {
          trackRequestLoadingTime({
            requestTime: `${Date.now() - start / 1000}s`,
            numberPotentialProblems: result.data.alerts.length,
            windowSize: globalTimeConfig.windowSize,
            chartName
          });
          startTime.current = null;
        }
      }
    });
}
