import PropTypes from 'prop-types';
import React from 'react';

import {
  withSlownessFormHistoricBaseline,
  withSlownessFormStaticThreshold
} from 'in-websites/eum-alerting/form/slownessForm';
import SelectAlertForStatusCode from 'in-websites/eum-alerting/simple/SelectAlertForStatusCode/SelectAlertForStatusCode';
import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import SimpleModeStepContentWrapper from 'in-new-components/Alerting/components/SimpleModeStepContentWrapper';
import { fieldNames, hiddenFieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import { modeSimple, thresholdOrBaselineLoadingSignal$ } from 'in-websites/eum-alerting/constants';
import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { alertTypeConfig, alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { websitesAlertingBlueprintChanged } from 'in-websites/eum-alerting/tracker';
import StatusCodeChart from 'in-websites/eum-alerting/components/StatusCodeChart';
import JsErrorsChart from 'in-websites/eum-alerting/components/JsErrorsChart';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import Menu from 'in-websites/eum-alerting/components/Menu';

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  onChange,
  setJsErrorsListVisible,
  timeConfig
}) {
  const alertType = alertTypeConfig[getIndexSelectedConf(form)].type;
  const thresholdTypeValue = form.get(fieldNames.thresholdType).value;
  const thresholdBaseline = form.get(fieldNames.thresholdBaseline);

  // Fallback to static threshold for slowness when the historic baseline was not good enough.
  if (
    alertType === alertTypes.slowness &&
    thresholdTypeValue.includes('historicBaseline.') &&
    thresholdBaseline &&
    thresholdBaseline.value &&
    thresholdBaseline.value.length === 0
  ) {
    onChange(form, fieldNames.thresholdType, 'staticThreshold', {
      name: hiddenFieldNames.calculateThresholdOnBackend,
      value: true
    });
  }

  return (
    <SimpleModeStepContentWrapper headline="What do you want to be alerted on?">
      <Menu
        itemLabels={alertTypeConfig.map(({ name }) => name)}
        itemClickTracker={selectedItemIndex => {
          let metricToSelect;
          const alertType = alertTypeConfig[selectedItemIndex].type;

          let updatedForm = form;
          let thresholdTypeValue = 'staticThreshold';
          if (alertType === alertTypes.specificJsError) {
            metricToSelect = { name: fieldNames.ruleMetricName, value: 'errors' };
            updatedForm = withJsErrorsFormSpecificError(form);
          } else if (alertType === alertTypes.specificStatusCode) {
            metricToSelect = { name: fieldNames.ruleMetricName, value: 'httpxxx' };
            updatedForm = withStatusCodesFormSpecificStatusCode(form);
          } else if (alertType === alertTypes.slowness) {
            metricToSelect = { name: fieldNames.ruleMetricName, value: 'onLoadTime' };
            thresholdTypeValue = form.get(fieldNames.thresholdType).value;
            const thresholdBaseline = form.get(fieldNames.thresholdBaseline);

            // On the first load or when the baseline is OK, use baseline
            if (
              !thresholdTypeValue.includes('historicBaseline.') &&
              (!thresholdBaseline || (thresholdBaseline.value && thresholdBaseline.value.length > 0))
            ) {
              thresholdTypeValue = 'historicBaseline.DAILY';
            }

            if (thresholdTypeValue === 'staticThreshold') {
              updatedForm = withSlownessFormStaticThreshold(form);
            } else if (thresholdTypeValue.includes('historicBaseline.')) {
              updatedForm = withSlownessFormHistoricBaseline(form);
            }
          }

          const newAlertType = alertTypeConfig[selectedItemIndex].type;

          thresholdOrBaselineLoadingSignal$.emit(true);

          onChange(
            updatedForm,
            fieldNames.ruleAlertType,
            newAlertType,
            metricToSelect,
            { name: fieldNames.thresholdType, value: thresholdTypeValue },
            { name: hiddenFieldNames.calculateThresholdOnBackend, value: true }
          );

          websitesAlertingBlueprintChanged({ newBluePrint: newAlertType, mode: modeSimple });
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
    </SimpleModeStepContentWrapper>
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
