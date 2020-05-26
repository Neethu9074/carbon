import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/simple/SimpleModeStepContentWrapper';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import SelectedBlueprintPresenter from 'in-new-components/Alerting/simple/SelectedBlueprintPresenter';
import { alertingDialogItemPickerTimeframe } from 'in-new-components/Alerting/utils/timeConfigUtils';
import { applicationsAlertingBlueprintChanged } from 'in-applications/alerting/tracker';
import ProvideLogMessage from 'in-applications/alerting/components/ProvideLogMessage';
import ProvideStatusCode from 'in-applications/alerting/components/ProvideStatusCode';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import { blueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import Menu from 'in-new-components/Alerting/components/Menu';

export default function SimpleAlertConfigDialogStep1({
  form,
  setLogMessagesListVisible,
  updateForm,
  onChartConfigChange,
  indexInitialSelectedTimeConfig
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
        renderStatusCode={() => (
          <SelectedBlueprintPresenter
            title={selectedBlueprintConfig.headline}
            description={selectedBlueprintConfig.text}
          >
            <ProvideStatusCode form={form} updateForm={updateForm} mode="SimpleMode" />
          </SelectedBlueprintPresenter>
        )}
      />

      <SimpleAlertConfigDialogChart
        form={form}
        onChartConfigChange={onChartConfigChange}
        indexInitialSelectedTimeConfig={indexInitialSelectedTimeConfig}
      />
    </SimpleModeStepContentWrapper>
  );
}
