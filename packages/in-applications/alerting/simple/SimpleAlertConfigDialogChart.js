import PropTypes from 'prop-types';
import React from 'react';

import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import StatusCodeAlertingBarChart from 'in-applications/alerting/chart/StatusCodeAlertingBarChart';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import SlownessAlertingBarChart from 'in-applications/alerting/chart/SlownessAlertingBarChart';
import LogsAlertingBarChart from 'in-applications/alerting/chart/LogsAlertingBarChart';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import { propTypeTimeConfig } from 'in-stores/time/config';

import locals from './SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, granularity, timeConfig }) {
  const applicationId = form.get('applicationId').value;
  const rule = form.get('rule').toJS();
  const tagFilters = form.get('tagFilters').value;
  const threshold = form.get('threshold').toJS();
  const timeThreshold = form.get('timeThreshold').toJS();
  const boundaryScope = form.get('boundaryScope').value;

  return (
    <AlertTypeSwitch
      alertType={rule.alertType}
      renderErrorRate={() => (
        <div className={locals.placeholder}>
          <ErrorRateAlertingBarChart
            applicationId={applicationId}
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            granularity={granularity}
            threshold={threshold}
            timeThreshold={timeThreshold}
            boundaryScope={boundaryScope}
            alertsPreviewEnabled
            canReload
          />
        </div>
      )}
      renderSlowness={() => (
        <div className={locals.placeholder}>
          <SlownessAlertingBarChart
            applicationId={applicationId}
            threshold={threshold}
            timeThreshold={timeThreshold}
            sensitivity={threshold.deviationFactor}
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            aggregation={rule.aggregation}
            granularity={granularity}
            boundaryScope={boundaryScope}
            alertsPreviewEnabled
            canReload
          />
        </div>
      )}
      renderLogs={() => (
        <>
          {hasLogMessageSelected(form) ? (
            <div className={locals.placeholder}>
              <LogsAlertingBarChart
                applicationId={applicationId}
                logMessage={rule.message}
                logMessageOperator={rule.operator}
                logLevel={rule.level}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                granularity={granularity}
                threshold={threshold}
                timeThreshold={timeThreshold}
                boundaryScope={boundaryScope}
                alertsPreviewEnabled
                canReload
              />
            </div>
          ) : (
            <IncompleteChartPlaceholder message="Please select a Log Message to see when this alert triggers" />
          )}
        </>
      )}
      renderStatusCode={() => (
        <>
          {hasStatusCodeSelected(form) ? (
            <div className={locals.placeholder}>
              <StatusCodeAlertingBarChart
                applicationId={applicationId}
                statusCode={rule.value}
                statusCodeOperator={rule.operator}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                granularity={granularity}
                threshold={threshold}
                timeThreshold={timeThreshold}
                boundaryScope={boundaryScope}
                alertsPreviewEnabled
                canReload
              />
            </div>
          ) : (
            <IncompleteChartPlaceholder message="Please select a Status Code to see when this alert triggers" />
          )}
        </>
      )}
    />
  );
}

SimpleAlertConfigDialogChart.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  timeConfig: propTypeTimeConfig.isRequired
};

function hasLogMessageSelected(form) {
  return !!(form && form.get('rule').get('message').value);
}

function hasStatusCodeSelected(form) {
  return !!(form && form.get('rule').get('value').value);
}
