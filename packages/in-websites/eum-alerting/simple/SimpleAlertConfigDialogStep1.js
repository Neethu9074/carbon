import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { alertTypeConfig } from 'in-websites/eum-alerting/form/alertTypeConfigData';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
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
        itemClickTracker={selectedItremIndex => {
          onChange(form, fieldNames.ruleAlertType, alertTypeConfig[selectedItremIndex].type);
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
      <JsErrorsChart form={form} timeConfig={timeConfig} granularity={granularity} />
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
