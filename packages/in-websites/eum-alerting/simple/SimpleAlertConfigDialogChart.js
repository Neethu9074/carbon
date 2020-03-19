import PropTypes from 'prop-types';
import React from 'react';

import IncompleteChartPlaceholder from 'in-websites/eum-alerting/components/IncompleteChartPlaceholder';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import AlertTypeSwitch from 'in-websites/eum-alerting/components/AlertTypeSwitch';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/formHelpers';
import { getThreshold } from 'in-websites/eum-alerting/alertConfigUtil';

import locals from './SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, granularity, timeConfig }) {
  return (
    <AlertTypeSwitch
      alertType={form.get(fieldNames.ruleAlertType).value}
      JsErrorsComponent={() => (
        <>
          {hasJsErrorSelected(form) ? (
            <div className={locals.placeholder}>
              <JsErrorsAlertingBarChart
                websiteId={form.get(fieldNames.websiteId).value}
                timeConfig={timeConfig}
                tagFilters={form.get(fieldNames.tagFilters).value}
                errorFilter={{
                  name: 'beacon.error.message',
                  operator: form.get(fieldNames.ruleOperator).value,
                  stringValue: form.get(fieldNames.ruleValue).value
                }}
                metricName={form.get(fieldNames.ruleMetricName).value}
                granularity={granularity}
                threshold={getThreshold(form)}
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
      StatusCodeComponent={() => (
        <div className={locals.placeholder}>
          <StatusCodeAlertingBarChart
            websiteId={form.get(fieldNames.websiteId).value}
            threshold={getThreshold(form)}
            timeThreshold={form.get('timeThreshold').toJS()}
            timeConfig={timeConfig}
            tagFilters={form.get(fieldNames.tagFilters).value}
            numeratorFilter={{
              name: 'beacon.http.status',
              operator: form.get(fieldNames.ruleOperator).value,
              stringValue: form.get(fieldNames.ruleValue).value
            }}
            metricName={form.get(fieldNames.ruleMetricName).value}
            granularity={granularity}
            alertsPreviewEnabled
            canReload
          />
        </div>
      )}
      SlownessComponent={() => (
        <div className={locals.placeholder}>
          <SlownessAlertingBarChart
            websiteId={form.get(fieldNames.websiteId).value}
            threshold={getThreshold(form)}
            timeThreshold={form.get('timeThreshold').toJS()}
            sensitivity={getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor, 0)}
            timeConfig={timeConfig}
            tagFilters={form.get(fieldNames.tagFilters).value}
            aggregation={form.get(fieldNames.ruleAggregation).value}
            granularity={granularity}
            alertsPreviewEnabled
            canReload
          />
        </div>
      )}
    />
  );
}

SimpleAlertConfigDialogChart.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function hasJsErrorSelected(form) {
  return !!(form && form.get(fieldNames.ruleValue).value);
}
