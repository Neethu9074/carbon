import PropTypes from 'prop-types';
import React from 'react';

import {
  withSlownessFormHistoricBaseline,
  withSlownessFormStaticThreshold
} from 'in-websites/eum-alerting/form/slownessForm';
import SelectAlertForStatusCode from 'in-websites/eum-alerting/simple/SelectAlertForStatusCode/SelectAlertForStatusCode';
import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { alertTypeConfig, alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import StatusCodeChart from 'in-websites/eum-alerting/components/StatusCodeChart';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import Menu from 'in-websites/eum-alerting/components/Menu';

import locals from './SimpleAlertConfigDialogStep.mless';

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  onChange,
  setJsErrorsListVisible,
  timeConfig
}) {
  const alertType = alertTypeConfig[getIndexSelectedConf(form)].type;
  return (
    <>
      <h1 className={locals.headline}>What do you want to be alerted on?</h1>
      <Menu
        itemLabels={alertTypeConfig.map(({ name }) => name)}
        itemClickTracker={selectedItemIndex => {
          let metricToSelect;
          const alertType = alertTypeConfig[selectedItemIndex].type;

          let updatedForm = form;
          if (alertType === alertTypes.specificJsError) {
            metricToSelect = { name: fieldNames.ruleMetricName, value: 'errors' };
            updatedForm = withJsErrorsFormSpecificError(form);
          } else if (alertType === alertTypes.specificStatusCode) {
            metricToSelect = { name: fieldNames.ruleMetricName, value: 'httpxxx' };
            updatedForm = withStatusCodesFormSpecificStatusCode(form);
          } else if (alertType === alertTypes.slowness) {
            metricToSelect = { name: fieldNames.ruleMetricName, value: 'onLoadTime' };

            const thresholdType = form.get(fieldNames.thresholdType).value;
            if (thresholdType === 'staticThreshold') {
              updatedForm = withSlownessFormStaticThreshold(form);
            } else if (thresholdType.includes('historicBaseline.')) {
              updatedForm = withSlownessFormHistoricBaseline(form);
            }
          }

          const doCalculateThresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
          onChange(
            updatedForm,
            fieldNames.ruleAlertType,
            alertTypeConfig[selectedItemIndex].type,
            metricToSelect,
            doCalculateThresholdOnBackend
          );
        }}
        initialItemSelected={getIndexSelectedConf(form)}
        addRightSeparator
      />

      {alertType === alertTypes.specificJsError && (
        <SelectAlertForJsError
          form={form}
          onChange={onChange}
          timeConfig={timeConfig}
          onSelectJsError={setJsErrorsListVisible}
        />
      )}
      {alertType === alertTypes.specificStatusCode && (
        <SelectAlertForStatusCode form={form} onChange={onChange} timeConfig={timeConfig} />
      )}
      {alertType === alertTypes.slowness && (
        <AlertTypeDescription
          config={alertTypeConfig.find(({ type }) => form.get(fieldNames.ruleAlertType).value === type)}
        />
      )}

      <ChartSwitch
        alertType={form.get(fieldNames.ruleAlertType).value}
        JsErrorsComponent={() => <JsErrorsChart form={form} timeConfig={timeConfig} granularity={granularity} />}
        StatusCodeComponent={() => <StatusCodeChart form={form} timeConfig={timeConfig} granularity={granularity} />}
        SlownessComponent={() => <SlownessChart form={form} timeConfig={timeConfig} granularity={granularity} />}
      />
    </>
  );
}

SimpleAlertConfigDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  setJsErrorsListVisible: PropTypes.func.isRequired
};

function getIndexSelectedConf(form) {
  return alertTypeConfig.findIndex(({ type }) => form.get(fieldNames.ruleAlertType).value === type);
}
