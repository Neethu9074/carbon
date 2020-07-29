import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-new-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import SimpleAlertConfigDialogChart from 'in-applications/alerting/simple/SimpleAlertConfigDialogChart';
import { blueprintConfigs, getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { alertingDialogItemPickerTimeframe } from 'in-new-components/Alerting/constants';
import { applicationsAlertingBlueprintChanged } from 'in-applications/alerting/tracker';
import ProvideLogMessage from 'in-applications/alerting/components/ProvideLogMessage';
import ProvideStatusCode from 'in-applications/alerting/components/ProvideStatusCode';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import Menu from 'in-new-components/Alerting/components/Menu';

export default function SimpleAlertConfigDialogStep1({
  form,
  setLogMessagesListVisible,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertType = form.get('rule').get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <SimpleModeStepContentWrapper headline="What do you want to be alerted on?">
      <Menu
        items={blueprintConfigs}
        onItemClick={item => {
          let updatedForm = createBlueprintForm(form, item.type).updateIn(
            ['hiddenFields', 'calculateThresholdOnBackend'],
            f => f.setValue(true)
          );

          const thresholdType = updatedForm.get('threshold').get('type').value;
          // reset "old" threshold/baseline-value to ensure that we don't call endpoints with the previous values
          if (thresholdType === 'historicBaseline') {
            updatedForm = updatedForm.updateIn(['threshold', 'baseline'], f => f.setValue(null).setTouched(true));
          } else {
            updatedForm = updatedForm.updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true));
          }

          updateForm(updatedForm);

          applicationsAlertingBlueprintChanged({ newBluePrint: alertType, mode: 'Simple' });
        }}
        initialItemSelected={blueprintConfig}
        addRightSeparator
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderLogs={() => (
          <SelectedBlueprintPresenter title={blueprintConfig.headline} description={blueprintConfig.text}>
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
          <SelectedBlueprintPresenter title={blueprintConfig.headline} description={blueprintConfig.text} />
        )}
        renderErrorRate={() => (
          <SelectedBlueprintPresenter title={blueprintConfig.headline} description={blueprintConfig.text} />
        )}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter title={blueprintConfig.headline} description={blueprintConfig.text}>
            <ProvideStatusCode form={form} updateForm={updateForm} mode="SimpleMode" />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => (
          <SelectedBlueprintPresenter title={blueprintConfig.headline} description={blueprintConfig.text} />
        )}
      />

      <SimpleAlertConfigDialogChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      />
    </SimpleModeStepContentWrapper>
  );
}
