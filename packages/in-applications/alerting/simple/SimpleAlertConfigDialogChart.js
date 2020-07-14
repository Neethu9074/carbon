import PropTypes from 'prop-types';
import React from 'react';

import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import getStatusCodeChartConfig from 'in-applications/alerting/data/chartConfigForStatusCode';
import getErrorRateChartConfig from 'in-applications/alerting/data/chartConfigForErrorRate';
import getSlownessChartConfig from 'in-applications/alerting/data/chartConfigForSlowness';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import getLogsChartConfig from 'in-applications/alerting/data/chartConfigForLogs';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';

import locals from './SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }) {
  const applicationId = form.get('applicationId').value;
  const rule = form.get('rule').toJS();
  const tagFilters = form.get('tagFilters').value;
  const threshold = form.get('threshold').toJS();
  const timeThreshold = form.get('timeThreshold').toJS();
  const boundaryScope = form.get('boundaryScope').value;
  const granularity = form.get('granularity').value;
  return (
    <ChartViewConfigurator
      onChartViewConfigChange={onChartViewConfigChange}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      className={locals.position}
      framed
    >
      {chartViewConfig => (
        <AlertTypeSwitch
          alertType={rule.alertType}
          renderErrorRate={() => (
            <div className={locals.placeholder}>
              <AlertingBarChart
                chartConfigForBlueprint={getErrorRateChartConfig({
                  applicationId: applicationId,
                  viewConfig: chartViewConfig,
                  tagFilters: tagFilters,
                  granularity: granularity,
                  threshold: threshold,
                  timeThreshold: timeThreshold,
                  boundaryScope: boundaryScope,
                  alertsPreviewEnabled: true
                })}
                canReload
              />
            </div>
          )}
          renderSlowness={() => (
            <div className={locals.placeholder}>
              <AlertingBarChart
                chartConfigForBlueprint={getSlownessChartConfig({
                  applicationId: applicationId,
                  threshold: threshold,
                  timeThreshold: timeThreshold,
                  sensitivity: threshold.deviationFactor,
                  viewConfig: chartViewConfig,
                  tagFilters: tagFilters,
                  aggregation: rule.aggregation,
                  granularity: granularity,
                  boundaryScope: boundaryScope,
                  alertsPreviewEnabled: true
                })}
                canReload
              />
            </div>
          )}
          renderLogs={() => (
            <>
              {hasLogMessageSelected(form) ? (
                <div className={locals.placeholder}>
                  <AlertingBarChart
                    chartConfigForBlueprint={getLogsChartConfig({
                      applicationId: applicationId,
                      logMessage: rule.message,
                      logMessageOperator: rule.operator,
                      logLevel: rule.level,
                      viewConfig: chartViewConfig,
                      tagFilters: tagFilters,
                      granularity: granularity,
                      threshold: threshold,
                      timeThreshold: timeThreshold,
                      boundaryScope: boundaryScope,
                      alertsPreviewEnabled: true
                    })}
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
                  <AlertingBarChart
                    chartConfigForBlueprint={getStatusCodeChartConfig({
                      applicationId: applicationId,
                      statusCodeStart: rule.statusCodeStart,
                      statusCodeEnd: rule.statusCodeEnd,
                      viewConfig: chartViewConfig,
                      tagFilters: tagFilters,
                      granularity: granularity,
                      threshold: threshold,
                      timeThreshold: timeThreshold,
                      boundaryScope: boundaryScope,
                      alertsPreviewEnabled: true
                    })}
                    canReload
                  />
                </div>
              ) : (
                <IncompleteChartPlaceholder message="Please select a Status Code to see when this alert triggers" />
              )}
            </>
          )}
        />
      )}
    </ChartViewConfigurator>
  );
}

SimpleAlertConfigDialogChart.propTypes = {
  form: PropTypes.object.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};

function hasLogMessageSelected(form) {
  return !!(form && form.get('rule').get('message').value);
}

function hasStatusCodeSelected(form) {
  return !!(form && form.get('rule').get('statusCodeStart').value && form.get('rule').get('statusCodeEnd').value);
}
