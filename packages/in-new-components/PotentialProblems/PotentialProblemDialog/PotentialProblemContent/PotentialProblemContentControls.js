/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-new-components/PotentialProblems/PotentialProblemsLane/proptypes';
import getConfigByDataSource, { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { trackCreateSmartAlert, trackGotoAnalyze } from 'in-new-components/PotentialProblems/tracker';
import { defaultGranularity } from 'in-new-components/PotentialProblems/constants';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button/Button';
import { role } from 'in-stores/user';

export default function PotentialProblemContentControls({
  applicationLabel,
  serviceLabel,
  endpointLabel,
  tagFilters,
  boundaryScope,
  alert,
  alertType,
  rule,
  threshold,
  renderSmartAlertDialogComponent
}) {
  return (
    <>
      <Button
        kind="primary"
        onClick={e => {
          e.stopPropagation();
          trackGotoAnalyze({
            metricName: rule.metricName
          });
          close();
        }}
        icon="lib_analyze"
        href$={getLinkToAnalyze({
          dataSource: 'calls',
          applicationName: applicationLabel,
          serviceName: serviceLabel,
          endpointName: endpointLabel,
          boundaryScope: boundaryScope,
          groupByTag: getGrouping(alertType, tagFilters),
          focusedMetric: getFocusedMetric(alertType),
          timeConfig: getTimeConfigForAnalayzeLink(alert)
        })}
      >
        Investigate
      </Button>
      {role.canConfigureCustomAlerts && (
        <Button
          kind="secondaryDarker"
          onClick={() => {
            addActiveDialog(
              renderSmartAlertDialogComponent({
                rule,
                threshold,
                applicationLabel,
                boundaryScope,
                granularity: defaultGranularity
              })
            );
            trackCreateSmartAlert({
              metricName: rule.metricName
            });
          }}
          icon="lib_alerts_create"
        >
          Add Smart Alert
        </Button>
      )}
    </>
  );
}

function getFocusedMetric(alertType) {
  if (alertType === 'slowness') {
    return 'latency_DISTRIBUTION';
  }
  if (alertType === 'errorRate') {
    return 'errors_MEAN';
  }
  // at the moment only 'latency_DISTRIBUTION' is available when no grouping is set. However, the analyze-view handles
  // this case properly and then shows the latency-distribution chart instead.
  return 'calls_SUM';
}

function getGrouping(alertType, filters) {
  const alertTypeWithDisabledGrouping = ['errorRate', 'slowness'];
  if (alertTypeWithDisabledGrouping.includes(alertType)) {
    return {}; // no grouping
  }

  if (alertType === 'throughput') {
    const needsGroupByEndpoint = filters.find(isEndpointOrServiceFilter);
    return needsGroupByEndpoint ? groupByEndpointName : groupByServiceName;
  }

  return getConfigByDataSource('calls').defaultGrouping;
}

const isEndpointOrServiceFilter = filter =>
  filter?.name &&
  (filter.name === 'endpoint.name' ||
    filter.name === 'service.name' ||
    filter.name === 'endpoint.id' ||
    filter.name === 'service.id');

function getTimeConfigForAnalayzeLink({ start, end }) {
  const eventDuration = end - start;
  const duration = eventDuration * 2;
  const to = end + eventDuration * 0.5;
  return {
    to,
    windowSize: duration
  };
}

PotentialProblemContentControls.propTypes = {
  alert: alertPropType.isRequired,
  rule: rulePropType.isRequired,
  alertType: PropTypes.string.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  serviceLabel: PropTypes.string,
  endpointLabel: PropTypes.string,
  boundaryScope: PropTypes.string,
  renderSmartAlertDialogComponent: PropTypes.func.isRequired,
  tagFilters: PropTypes.arrayOf(PropTypes.object).isRequired,
  threshold: thresholdPropType.isRequired
};
