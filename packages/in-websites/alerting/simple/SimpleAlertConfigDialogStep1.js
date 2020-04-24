import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/simple/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-new-components/Alerting/simple/SelectedBlueprintPresenter';
import SimpleAlertConfigDialogChart from 'in-websites/alerting/simple/SimpleAlertConfigDialogChart';
import { BlueprintDescription } from 'in-new-components/Alerting/components/BlueprintDescription';
import { alertingDialogItemPickerTimeframe, modeSimple } from 'in-websites/alerting/constants';
import { blueprintConfig, alertTypes } from 'in-websites/alerting/data/blueprintConfig';
import ProvideStatusCode from 'in-websites/alerting/components/ProvideStatusCode';
import createBlueprintForm from 'in-websites/alerting/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-websites/alerting/tracker';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import ProvideJsError from 'in-websites/alerting/components/ProvideJsError';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import Menu from 'in-new-components/Alerting/components/Menu';

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  onChange,
  setJsErrorsListVisible,
  timeConfig,
  updateForm
}) {
  const alertType = blueprintConfig[getIndexSelectedConf()].type;

  // Fallback to static threshold for slowness when the historic baseline was not good enough.
  const thresholdTypeValue = form.get('threshold').get('type').value;
  const thresholdBaseline = form.get('threshold').get('baseline');

  if (
    alertType === alertTypes.slowness &&
    thresholdTypeValue === 'historicBaseline' &&
    thresholdBaseline &&
    thresholdBaseline.value &&
    thresholdBaseline.value.length === 0
  ) {
    const newThresholdForm = createThresholdForm(
      {
        ...form.get('threshold').toJS(),
        type: 'staticThreshold'
      },
      alertType
    );

    updateForm(
      form
        .put('threshold', newThresholdForm)
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
        initialItemSelected={getIndexSelectedConf()}
        addRightSeparator
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderJsErrors={() => (
          <SelectedBlueprintPresenter
            title="Automatic Alerts for Specific JS Errors"
            description="You will be alerted every time matching JS Error messages occur more often than normal."
          >
            <ProvideJsError
              form={form}
              updateForm={updateForm}
              onSelectJsError={setJsErrorsListVisible}
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
              mode={modeSimple}
            />
          </SelectedBlueprintPresenter>
        )}
        renderSlowness={() => (
          <BlueprintDescription config={blueprintConfig.find(configTypeEqualsAlertType)} isSimpleMode />
        )}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter
            title="Automatic Alerts for Specific HTTP Status Codes"
            description="You will be alerted every time matching HTTP Status Codes occur more often than normal."
          >
            <ProvideStatusCode form={form} onChange={onChange} updateForm={updateForm} mode={modeSimple} />
          </SelectedBlueprintPresenter>
        )}
      />

      <SimpleAlertConfigDialogChart form={form} granularity={granularity} timeConfig={timeConfig} />
    </SimpleModeStepContentWrapper>
  );

  function getIndexSelectedConf() {
    return blueprintConfig.findIndex(configTypeEqualsAlertType);
  }

  function configTypeEqualsAlertType({ type }) {
    return form.get('rule').get('alertType').value === type;
  }
}

SimpleAlertConfigDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  setJsErrorsListVisible: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
