import PropTypes from 'prop-types';
import React from 'react';

import getConfigByDataSource, { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button/Button';
import { role } from 'in-stores/user';

export default function PotentialProblemContentControls({
  applicationLabel,
  tagFilters,
  boundaryScope,
  alert,
  alertType,
  alertConfig,
  renderSmartAlertDialogComponent,
  ...remainingProps
}) {
  return (
    <>
      <Button
        kind="primary"
        onClick={close}
        icon="lib_analyze"
        href$={getLinkToAnalyze({
          dataSource: 'calls',
          applicationName: applicationLabel,
          filters: tagFilters,
          boundaryScope: boundaryScope,
          groupByTag: getGrouping(alertType, tagFilters),
          focusedMetric: getFocusedMetric(alertType),
          timeConfig: {
            to: alert.start,
            windowSize: alert.end - alert.start
          }
        })}
      >
        Investigate
      </Button>

      {role.canConfigureCustomAlerts && (
        <Button
          kind="secondaryDarker"
          onClick={() =>
            addActiveDialog(
              renderSmartAlertDialogComponent({
                ...remainingProps,
                ...alertConfig,
                applicationLabel,
                tagFilters,
                boundaryScope
              })
            )
          }
          icon="lib_alerts_create"
        >
          Add Smart Alert
        </Button>
      )}
      {/* <Button kind="secondaryDarker" onClick={() => {}} icon="lib_actions_download">
  Generate Report
</Button> */}
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

PotentialProblemContentControls.propTypes = {
  alert: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number.isRequired
  }).isRequired,
  alertConfig: PropTypes.object.isRequired,
  alertType: PropTypes.string.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  boundaryScope: PropTypes.string,
  renderSmartAlertDialogComponent: PropTypes.func.isRequired,
  tagFilters: PropTypes.arrayOf(PropTypes.object).isRequired
};
