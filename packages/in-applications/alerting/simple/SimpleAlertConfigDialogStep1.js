import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/simple/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import SelectedBlueprintPresenter from 'in-new-components/Alerting/simple/SelectedBlueprintPresenter';
import { applicationsAlertingBlueprintChanged } from 'in-applications/alerting/tracker';
import { alertingDialogItemPickerTimeframe } from 'in-applications/alerting/constants';
import ProvideLogMessage from 'in-applications/alerting/components/ProvideLogMessage';
import ProvideStatusCode from 'in-applications/alerting/components/ProvideStatusCode';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import { blueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import Menu from 'in-new-components/Alerting/components/Menu';
import { propTypeTimeConfig } from 'in-stores/time/config';

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  setLogMessagesListVisible,
  timeConfig,
  updateForm
}) {
  const alertType = blueprintConfig[getIndexSelectedConf()].type;

  // Fallback to static threshold for slowness when the historic baseline was not good enough.
  const thresholdTypeValue = form.get('threshold').get('type').value;
  const thresholdBaseline = form.get('threshold').get('baseline');

  if (
    alertType === 'slowness' &&
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

          applicationsAlertingBlueprintChanged({ newBluePrint: alertType, mode: 'Simple' });
        }}
        initialItemSelected={getIndexSelectedConf()}
        addRightSeparator
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderLogs={() => (
          <SelectedBlueprintPresenter
            title="Automatic Alerts for Error and Warning Logs"
            description="Receive an alert when the number of calls logging matching error and warning messages is higher than expected."
          >
            <ProvideLogMessage
              form={form}
              updateForm={updateForm}
              onSelectLogMessage={setLogMessagesListVisible}
              mode="SimpleMode"
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
            />
          </SelectedBlueprintPresenter>
        )}
        renderSlowness={() => (
          <SelectedBlueprintPresenter
            title="Automatic Alerts for Slow Calls"
            description="Receive an alert when calls to selected services and endpoints of this Application Perspective are slower than usual."
          />
        )}
        renderErrorRate={() => (
          <SelectedBlueprintPresenter
            title="Automatic Alerts for Erroneous Calls"
            description="Receive an alert when the rate of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal."
          />
        )}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter
            title="Alert for Specific Status Code"
            description="Receive an alert when the status code is higher than expected "
          >
            <ProvideStatusCode form={form} updateForm={updateForm} mode="SimpleMode" />
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
  setLogMessagesListVisible: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  updateForm: PropTypes.func.isRequired
};
