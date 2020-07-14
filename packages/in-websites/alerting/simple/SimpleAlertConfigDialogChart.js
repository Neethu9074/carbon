import PropTypes from 'prop-types';
import React from 'react';

import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import getStatusCodeChartConfig from 'in-websites/alerting/data/chartConfigForStatusCode';
import getSlownessChartConfig from 'in-websites/alerting/data/chartConfigForSlowness';
import getJsErrorsChartConfig from 'in-websites/alerting/data/chartConfigForJsErrors';
import { fieldNames } from 'in-websites/alerting/form/alertDialogFormDefinition';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import { getFormValueOrDefault } from 'in-websites/alerting/form/formUtils';

import locals from './SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }) {
  const granularity = form.get('granularity').value;
  return (
    <ChartViewConfigurator
      onChartViewConfigChange={onChartViewConfigChange}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      className={locals.offset}
      framed
    >
      {chartViewConfig => (
        <AlertTypeSwitch
          alertType={form.get('rule').get('alertType').value}
          renderJsErrors={() => (
            <>
              {hasJsErrorSelected(form) ? (
                <div className={locals.placeholder}>
                  <AlertingBarChart
                    chartConfigForBlueprint={getJsErrorsChartConfig({
                      websiteId: form.get(fieldNames.websiteId).value,
                      viewConfig: chartViewConfig,
                      tagFilters: form.get(fieldNames.tagFilters).value,
                      errorFilter: {
                        name: 'beacon.error.message',
                        operator: form.get('rule').get('operator').value,
                        stringValue: form.get('rule').get('value').value
                      },
                      metricName: form.get('rule').get('metricName').value,
                      granularity: granularity,
                      threshold: form.get('threshold').toJS(),
                      timeThreshold: form.get('timeThreshold').toJS(),
                      alertsPreviewEnabled: true
                    })}
                    canReload
                  />
                </div>
              ) : (
                <IncompleteChartPlaceholder message="Please select a JS Error to see when this alert triggers" />
              )}
            </>
          )}
          renderStatusCode={() => (
            <div className={locals.placeholder}>
              <AlertingBarChart
                chartConfigForBlueprint={getStatusCodeChartConfig({
                  websiteId: form.get(fieldNames.websiteId).value,
                  threshold: form.get('threshold').toJS(),
                  timeThreshold: form.get('timeThreshold').toJS(),
                  viewConfig: chartViewConfig,
                  tagFilters: form.get(fieldNames.tagFilters).value,
                  numeratorFilter: {
                    name: 'beacon.http.status',
                    operator: form.get('rule').get('operator').value,
                    stringValue: form.get('rule').get('value').value
                  },
                  metricName: form.get('rule').get('metricName').value,
                  granularity: granularity,
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
                  websiteId: form.get(fieldNames.websiteId).value,
                  threshold: form.get('threshold').toJS(),
                  timeThreshold: form.get('timeThreshold').toJS(),
                  sensitivity: getFormValueOrDefault(form.get('threshold'), 'deviationFactor', 0),
                  viewConfig: chartViewConfig,
                  tagFilters: form.get(fieldNames.tagFilters).value,
                  aggregation: form.get('rule').get('aggregation').value,
                  granularity: granularity,
                  alertsPreviewEnabled: true
                })}
                canReload
              />
            </div>
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

function hasJsErrorSelected(form) {
  return !!(form && form.get('rule').get('value').value);
}
