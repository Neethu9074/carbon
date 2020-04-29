import PropTypes from 'prop-types';
import React from 'react';

import IncompleteChartPlaceholder from 'in-new-components/Alerting/components/IncompleteChartPlaceholder';
import StatusCodeAlertingBarChart from 'in-websites/alerting/chart/StatusCodeAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/alerting/chart/SlownessAlertingBarChart';
import JsErrorsAlertingBarChart from 'in-websites/alerting/chart/JsErrorsAlertingBarChart';
import TimeConfigSelector from 'in-new-components/Alerting/components/TimeConfigSelector';
import { fieldNames } from 'in-websites/alerting/form/alertDialogFormDefinition';
import { timeConfigs } from 'in-new-components/Alerting/utils/timeConfigUtils';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import { getFormValueOrDefault } from 'in-websites/alerting/form/formUtils';

import locals from './SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onTimeConfigChange, indexInitialSelectedTimeConfig }) {
  return (
    <TimeConfigSelector
      configs={timeConfigs}
      onTimeConfigChange={onTimeConfigChange}
      indexInitialSelectedTimeConfig={indexInitialSelectedTimeConfig}
      className={locals.position}
      framed
    >
      {({ timeConfig, granularity }) => (
        <AlertTypeSwitch
          alertType={form.get('rule').get('alertType').value}
          renderJsErrors={() => (
            <>
              {hasJsErrorSelected(form) ? (
                <div className={locals.placeholder}>
                  <JsErrorsAlertingBarChart
                    websiteId={form.get(fieldNames.websiteId).value}
                    timeConfig={timeConfig}
                    tagFilters={form.get(fieldNames.tagFilters).value}
                    errorFilter={{
                      name: 'beacon.error.message',
                      operator: form.get('rule').get('operator').value,
                      stringValue: form.get('rule').get('value').value
                    }}
                    metricName={form.get('rule').get('metricName').value}
                    granularity={granularity}
                    threshold={form.get('threshold').toJS()}
                    timeThreshold={form.get('timeThreshold').toJS()}
                    alertsPreviewEnabled
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
              <StatusCodeAlertingBarChart
                websiteId={form.get(fieldNames.websiteId).value}
                threshold={form.get('threshold').toJS()}
                timeThreshold={form.get('timeThreshold').toJS()}
                timeConfig={timeConfig}
                tagFilters={form.get(fieldNames.tagFilters).value}
                numeratorFilter={{
                  name: 'beacon.http.status',
                  operator: form.get('rule').get('operator').value,
                  stringValue: form.get('rule').get('value').value
                }}
                metricName={form.get('rule').get('metricName').value}
                granularity={granularity}
                alertsPreviewEnabled
                canReload
              />
            </div>
          )}
          renderSlowness={() => (
            <div className={locals.placeholder}>
              <SlownessAlertingBarChart
                websiteId={form.get(fieldNames.websiteId).value}
                threshold={form.get('threshold').toJS()}
                timeThreshold={form.get('timeThreshold').toJS()}
                sensitivity={getFormValueOrDefault(form.get('threshold'), 'deviationFactor', 0)}
                timeConfig={timeConfig}
                tagFilters={form.get(fieldNames.tagFilters).value}
                aggregation={form.get('rule').get('aggregation').value}
                granularity={granularity}
                alertsPreviewEnabled
                canReload
              />
            </div>
          )}
        />
      )}
    </TimeConfigSelector>
  );
}

SimpleAlertConfigDialogChart.propTypes = {
  form: PropTypes.object.isRequired,
  onTimeConfigChange: PropTypes.func.isRequired,
  indexInitialSelectedTimeConfig: PropTypes.number.isRequired
};

function hasJsErrorSelected(form) {
  return !!(form && form.get('rule').get('value').value);
}
