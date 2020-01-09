import PropTypes from 'prop-types';
import React from 'react';

import {
  withSlownessFormHistoricBaseline,
  withSlownessFormStaticThreshold
<<<<<<< HEAD
} from 'in-websites/eum-alerting/form/slownessForm';
import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { alertTypeConfig, alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
=======
} from 'in-websites/eum-alerting/data/slownessForm';
import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { alertTypeConfig, alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/data/jsErrorsForm';
import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
>>>>>>> 483fcbe09... Fix deleted form fields (#2449)
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
          const alertType = alertTypeConfig[selectedItemIndex].type;

          let updatedForm = form;
          if (alertType === alertTypes.specificJsError) {
            updatedForm = withJsErrorsFormSpecificError(form);
          }

          if (alertType === alertTypes.slowness) {
            const thresholdType = form.get(fieldNames.thresholdType).value;

            if (thresholdType === 'staticThreshold') {
              updatedForm = withSlownessFormStaticThreshold(form);
            }

            if (thresholdType.includes('historicBaseline.')) {
              updatedForm = withSlownessFormHistoricBaseline(form);
            }
          }

          // addMetricForOnLoadTime will only be added this way as long as we have not the secondary menu to select alert types
          const addMetricForOnLoadTime = { name: fieldNames.ruleMetricName, value: 'onLoadTime' };
          // addMetricForJsErrors will only be added this way as long as we have not the secondary menu to select alert types
          const addMetricForJsErrors = { name: fieldNames.ruleMetricName, value: 'errors' };
          const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
          onChange(
            updatedForm,
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
        alertType={form.get(fieldNames.ruleAlertType).value}
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
  timeConfig: PropTypes.object.isRequired,
  setJsErrorsListVisible: PropTypes.func.isRequired
};

function getIndexSelectedConf(form) {
  return alertTypeConfig.findIndex(({ type }) => form.get(fieldNames.ruleAlertType).value === type);
}
