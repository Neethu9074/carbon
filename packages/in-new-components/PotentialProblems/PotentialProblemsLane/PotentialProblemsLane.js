/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import PotentialProblemsLanePresenter from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsLanePresenter';
import getPotentialProblems from 'in-new-components/PotentialProblems/subscription/getPotentialProblems';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { trackRequestLoadingTime } from 'in-new-components/PotentialProblems/tracker';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { defaultGranularity } from 'in-new-components/PotentialProblems/constants';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time';

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
      applicationId={applicationId}
      labels={labels}
      tagFilters={getTagFilters(labels.serviceLabel, labels.endpointLabel)}
      tagFilterExpression={getTagFilterExpression(labels.serviceLabel, labels.endpointLabel)}
      chartName={chartName}
      globalTimeConfig={globalTimeConfig}
      clusterSizeMillis={clusterSizeMillis}
    />
  );
}

function PotentialProblemsLaneConnected({
  applicationId,
  boundaryScope,
  labels,
  tagFilters,
  tagFilterExpression,
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
        tagFilters,
        tagFilterExpression,
        startTime,
        chartName,
        boundaryScope,
        applicationId
      ]),
    [globalTimeConfig, alertRules, clusterSizeMillis, tagFilters, tagFilterExpression]
  );

  return (
    <PotentialProblemsLanePresenter
      {...remainingProps}
      {...labels}
      alertRules={alertRules}
      applicationId={applicationId}
      boundaryScope={boundaryScope}
      potentialProblems={potentialProblemsResult?.data ?? emptyPotentialProblems}
      tagFilters={tagFilters} // QB1
      tagFilterExpression={tagFilterExpression} // QB2
      isLoading={isLoading(potentialProblemsResult)}
    />
  );
}

function getTagFilters(serviceLabel, endpointLabel) {
  const tagFilters = [];

  if (serviceLabel) {
    tagFilters.push(qb1StringFilter('service.name', 'EQUALS', serviceLabel));
  }

  if (endpointLabel) {
    tagFilters.push(qb1StringFilter('endpoint.name', 'EQUALS', endpointLabel));
  }

  return tagFilters;
}

function getTagFilterExpression(serviceLabel, endpointLabel) {
  const elements = [];

  if (serviceLabel) {
    elements.push(tagFilter('service.name', 'EQUALS', serviceLabel));
  }

  if (endpointLabel) {
    elements.push(tagFilter('endpoint.name', 'EQUALS', endpointLabel));
  }

  if (elements.length === 1) {
    return elements[0];
  }

  return {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements
  };
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

/* This function is implemented after the respective backend function.
   See: https://github.com/instana/backend/blob/c27424b3a0b64ea38169f102450c721292184e84/ui-backend/src/main/java/com/instana/ui/service/smartAlerts/application/ApplicationPotentialProblemsService.java#L86
*/
function isOutsideCallsShortTermStorage(globalTimeConfig) {
  const now = Date.now();
  const granularity = defaultGranularity;
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
  tagFilters,
  tagFilterExpression,
  startTime,
  chartName,
  boundaryScope,
  applicationId
]) {
  return getPotentialProblems({
    timeConfig: globalTimeConfig,
    alertRules,
    ...switchQB1orQB2Helper(
      () => ({ tagFilters: enhanceTagFilters(tagFilters, boundaryScope, applicationId) }),
      () => ({ tagFilterExpression: enhanceTagFilterExpression(tagFilterExpression, boundaryScope, applicationId) })
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

function enhanceTagFilterExpression(tagFilterExpression, boundaryScope, applicationId) {
  const appIdTagFilter = tagFilter(
    boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id',
    'EQUALS',
    applicationId
  );

  return addTagFilters(tagFilterExpression, [appIdTagFilter]);
}

function enhanceTagFilters(tagFilters, boundaryScope, applicationId) {
  return [
    ...tagFilters,
    qb1StringFilter(boundaryScope === 'INBOUND' ? 'boundary.application.id' : 'application.id', 'EQUALS', applicationId)
  ];
}

/**
 * Creates a tagFilter in the old QB1 format. This is needed because the new format is not fully working
 * in all places in the UI.
 */
function qb1StringFilter(name, operator, stringValue) {
  return { name, operator, stringValue };
}
