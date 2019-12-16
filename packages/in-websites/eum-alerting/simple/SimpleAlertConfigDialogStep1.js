import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import { alertTypeConfig } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import Menu from 'in-websites/eum-alerting/components/Menu';

import locals from './SimpleAlertConfigDialogStep.mless';

const specificJsErrors = alertTypeConfig[0].type;

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  onChange,
  setJsErrorsListVisible,
  timeConfig
}) {
  return (
    <>
      <h1 className={locals.headline}>What do you want to be alerted on?</h1>
      <Menu
        itemLabels={alertTypeConfig.map(({ name }) => name)}
        itemClickTracker={selectedItemIndex => {
          // addMetricForOnLoadTime will only be added this way as long as we have not the secondary menu to select alert types
          const addMetricForOnLoadTime = { name: fieldNames.ruleMetricName, value: 'onLoadTime' };
          // addMetricForJsErrors will only be added this way as long as we have not the secondary menu to select alert types
          const addMetricForJsErrors = { name: fieldNames.ruleMetricName, value: 'errors' };
          const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
          onChange(
            form,
            fieldNames.ruleAlertType,
            alertTypeConfig[selectedItemIndex].type,
            selectedItemIndex === 1 ? addMetricForOnLoadTime : addMetricForJsErrors,
            doCalculateTresholdOnBackend
          );
        }}
        initialItemSelected={getIndexSelectedConf(form)}
        addRightSeparator
      />
      {alertTypeConfig[getIndexSelectedConf(form)].type === specificJsErrors ? (
        <SelectAlertForJsError
          form={form}
          onChange={onChange}
          timeConfig={timeConfig}
          onSelectJsError={setJsErrorsListVisible}
        />
      ) : (
        <AlertTypeDescription
          config={alertTypeConfig.find(({ type }) => form.get(fieldNames.ruleAlertType).value === type)}
        />
      )}
      <ChartSwitch
        form={form}
        JsErrorsComponent={() => <JsErrorsChart form={form} timeConfig={timeConfig} granularity={granularity} />}
        SlownessComponent={() => <SlownessChart form={form} timeConfig={timeConfig} granularity={granularity} />}
      />
    </>
  );
}

SimpleAlertConfigDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getIndexSelectedConf(form) {
  return alertTypeConfig.findIndex(({ type }) => form.get(fieldNames.ruleAlertType).value === type);
}
