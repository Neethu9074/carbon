import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/simple/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import SelectedBlueprintPresenter from 'in-new-components/Alerting/simple/SelectedBlueprintPresenter';
import { applicationsAlertingBlueprintChanged } from 'in-applications/alerting/tracker';
import { alertingDialogItemPickerTimeframe } from 'in-applications/alerting/constants';
import ProvideLogMessage from 'in-applications/alerting/components/ProvideLogMessage';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import { blueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import Menu from 'in-new-components/Alerting/components/Menu';
import { propTypeTimeConfig } from 'in-stores/time/config';

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  setLogMessagesListVisible,
  timeConfig,
  updateForm
}) {
  const alertType = form.get('rule').get('alertType').value;
  const selectedBlueprintConfig = blueprintConfig.find(item => item.type === alertType);

  return (
    <SimpleModeStepContentWrapper headline="What do you want to be alerted on?">
      <Menu
        items={blueprintConfig}
        onItemClick={item => {
          updateForm(
            createBlueprintForm(form, item.type).updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f =>
              f.setValue(true)
            )
          );

          applicationsAlertingBlueprintChanged({ newBluePrint: alertType, mode: 'Simple' });
        }}
        initialItemSelected={selectedBlueprintConfig}
        addRightSeparator
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderLogs={() => (
          <SelectedBlueprintPresenter
            title={selectedBlueprintConfig.headline}
            description={selectedBlueprintConfig.text}
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
            title={selectedBlueprintConfig.headline}
            description={selectedBlueprintConfig.text}
          />
        )}
        renderErrorRate={() => (
          <SelectedBlueprintPresenter
            title={selectedBlueprintConfig.headline}
            description={selectedBlueprintConfig.text}
          />
        )}
      />

      <SimpleAlertConfigDialogChart form={form} granularity={granularity} timeConfig={timeConfig} />
    </SimpleModeStepContentWrapper>
  );
}

SimpleAlertConfigDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  setLogMessagesListVisible: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  updateForm: PropTypes.func.isRequired
};
