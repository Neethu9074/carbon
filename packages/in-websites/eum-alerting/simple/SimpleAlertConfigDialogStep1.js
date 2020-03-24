import PropTypes from 'prop-types';
import React from 'react';

import {
  withSlownessFormHistoricBaseline,
  withSlownessFormStaticThreshold
} from 'in-websites/eum-alerting/form/slownessForm';
import SelectAlertForStatusCode from 'in-websites/eum-alerting/simple/SelectAlertForStatusCode/SelectAlertForStatusCode';
import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import SimpleModeStepContentWrapper from 'in-new-components/Alerting/components/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-websites/eum-alerting/simple/SimpleAlertConfigDialogChart';
import { withStatusCodesFormSpecificStatusCode } from 'in-websites/eum-alerting/form/statusCodesForm';
import { AlertTypeDescription } from 'in-websites/eum-alerting/components/AlertTypeDescription';
import { alertTypeConfig, alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { withJsErrorsFormSpecificError } from 'in-websites/eum-alerting/form/jsErrorsForm';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { websitesAlertingBlueprintChanged } from 'in-websites/eum-alerting/tracker';
import createRuleForm from 'in-websites/eum-alerting/form/ruleForm';
import { modeSimple } from 'in-websites/eum-alerting/constants';
import Menu from 'in-websites/eum-alerting/components/Menu';

const getMetricNameForAlertType = {
  specificJsError: 'errors',
  statusCode: 'httpxxx',
  slowness: 'onLoadTime'
};

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  onChange,
  setJsErrorsListVisible,
  timeConfig,
  updateForm
}) {
  const alertType = alertTypeConfig[getIndexSelectedConf(form)].type;

  // Fallback to static threshold for slowness when the historic baseline was not good enough.
  const thresholdTypeValue = form.get(fieldNames.thresholdType).value;
  const thresholdBaseline = form.get(fieldNames.thresholdBaseline);

  if (
    alertType === alertTypes.slowness &&
    thresholdTypeValue.includes('historicBaseline.') &&
    thresholdBaseline &&
    thresholdBaseline.value &&
    thresholdBaseline.value.length === 0
  ) {
    updateForm(
      form
        .updateIn([fieldNames.thresholdType], f => f.setValue('staticThreshold').setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }

  return (
    <SimpleModeStepContentWrapper headline="What do you want to be alerted on?">
      <Menu
        itemLabels={alertTypeConfig.map(({ name }) => name)}
        itemClickTracker={selectedItemIndex => {
          const alertType = alertTypeConfig[selectedItemIndex].type;

          const newRuleForm = createRuleForm(
            {
              ...form.get('rule').toJS(),
              alertType,
              metricName: getMetricNameForAlertType[alertType]
            },
            form.get(fieldNames.thresholdType).value
          );

          let newForm = form.put('rule', newRuleForm);

          if (alertType === alertTypes.specificJsError) {
            updateForm(
              withJsErrorsFormSpecificError(newForm)
                .updateIn([fieldNames.thresholdType], f => f.setValue('staticThreshold').setTouched(true))
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            );
          }

          if (alertType === alertTypes.specificStatusCode) {
            updateForm(
              withStatusCodesFormSpecificStatusCode(newForm)
                .updateIn([fieldNames.thresholdType], f => f.setValue('staticThreshold').setTouched(true))
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            );
          }

          if (alertType === alertTypes.slowness) {
            let thresholdTypeValue = newForm.get(fieldNames.thresholdType).value;
            const thresholdBaseline = newForm.get(fieldNames.thresholdBaseline);

            // On the first load or when the baseline is OK, use baseline
            if (
              !thresholdTypeValue.includes('historicBaseline.') &&
              (!thresholdBaseline || (thresholdBaseline.value && thresholdBaseline.value.length > 0))
            ) {
              thresholdTypeValue = 'historicBaseline.DAILY';
            }

            if (thresholdTypeValue === 'staticThreshold') {
              newForm = withSlownessFormStaticThreshold(newForm);
            } else if (thresholdTypeValue.includes('historicBaseline.')) {
              newForm = withSlownessFormHistoricBaseline(newForm);
            }

            updateForm(
              newForm
                .updateIn([fieldNames.thresholdType], f => f.setValue(thresholdTypeValue).setTouched(true))
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            );
          }

          websitesAlertingBlueprintChanged({ newBluePrint: alertType, mode: modeSimple });
        }}
        initialItemSelected={getIndexSelectedConf(form)}
        addRightSeparator
      />

      {alertType === alertTypes.specificJsError && (
        <SelectAlertForJsError
          form={form}
          updateForm={updateForm}
          onChange={onChange}
          timeConfig={timeConfig}
          onSelectJsError={setJsErrorsListVisible}
        />
      )}
      {alertType === alertTypes.specificStatusCode && (
        <SelectAlertForStatusCode form={form} onChange={onChange} timeConfig={timeConfig} updateForm={updateForm} />
      )}
      {alertType === alertTypes.slowness && (
        <AlertTypeDescription
          updateForm={updateForm}
          config={alertTypeConfig.find(({ type }) => form.get('rule').get('alertType').value === type)}
        />
      )}

      <SimpleAlertConfigDialogChart form={form} granularity={granularity} timeConfig={timeConfig} />
    </SimpleModeStepContentWrapper>
  );
}

SimpleAlertConfigDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  setJsErrorsListVisible: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};

function getIndexSelectedConf(form) {
  return alertTypeConfig.findIndex(({ type }) => form.get('rule').get('alertType').value === type);
}
