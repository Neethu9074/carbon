import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertForStatusCode from 'in-websites/eum-alerting/simple/SelectAlertForStatusCode/SelectAlertForStatusCode';
import SelectAlertForJsError from 'in-websites/eum-alerting/simple/SelectAlertForJsError/SelectAlertForJsError';
import SimpleModeStepContentWrapper from 'in-new-components/Alerting/components/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-websites/eum-alerting/simple/SimpleAlertConfigDialogChart';
import { BlueprintDescription } from 'in-new-components/Alerting/components/BlueprintDescription';
import { blueprintConfig, alertTypes } from 'in-websites/eum-alerting/data/blueprintConfig';
import createBlueprintForm from 'in-websites/eum-alerting/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-websites/eum-alerting/tracker';
import { modeSimple } from 'in-websites/eum-alerting/constants';
import Menu from 'in-new-components/Alerting/components/Menu';

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  onChange,
  setJsErrorsListVisible,
  timeConfig,
  updateForm
}) {
  const alertType = blueprintConfig[getIndexSelectedConf(form)].type;

  // Fallback to static threshold for slowness when the historic baseline was not good enough.
  const thresholdTypeValue = form.get('threshold').get('type').value;
  const thresholdBaseline = form.get('threshold').get('baseline');

  if (
    alertType === alertTypes.slowness &&
    thresholdTypeValue.includes('historicBaseline.') &&
    thresholdBaseline &&
    thresholdBaseline.value &&
    thresholdBaseline.value.length === 0
  ) {
    updateForm(
      form
        .updateIn(['threshold', 'type'], f => f.setValue('staticThreshold').setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }

  return (
    <SimpleModeStepContentWrapper headline="What do you want to be alerted on?">
      <Menu
        itemLabels={blueprintConfig.map(({ name }) => name)}
        onItemClick={selectedItemIndex => {
          updateForm(
            createBlueprintForm(form, blueprintConfig[selectedItemIndex].type).updateIn(
              ['hiddenFields', 'calculateThresholdOnBackend'],
              f => f.setValue(true)
            )
          );

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
        <BlueprintDescription
          config={blueprintConfig.find(({ type }) => form.get('rule').get('alertType').value === type)}
          isSimpleMode
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
  return blueprintConfig.findIndex(({ type }) => form.get('rule').get('alertType').value === type);
}
