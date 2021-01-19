/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getSimpleModeBlueprintConfig, simpleModeBlueprintConfigs } from 'in-websites/alerting/data/blueprintConfig';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-new-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import SimpleAlertConfigDialogChart from 'in-websites/alerting/simple/SimpleAlertConfigDialogChart';
import { BlueprintDescription } from 'in-new-components/Alerting/components/BlueprintDescription';
import { alertingDialogItemPickerTimeframe } from 'in-new-components/Alerting/constants';
import ProvideStatusCode from 'in-websites/alerting/components/ProvideStatusCode';
import createBlueprintForm from 'in-websites/alerting/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-websites/alerting/tracker';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import ProvideJsError from 'in-websites/alerting/components/ProvideJsError';
import Menu from 'in-new-components/Alerting/components/Menu';
import { modeSimple } from 'in-websites/alerting/constants';

export default function SimpleAlertConfigDialogStep1({
  form,
  onChange,
  setJsErrorsListVisible,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);

  return (
    <SimpleModeStepContentWrapper headline="What do you want to be alerted on?">
      <Menu
        items={simpleModeBlueprintConfigs}
        onItemClick={item => {
          updateForm(
            createBlueprintForm(form, item.type, item.thresholdDefaults).updateIn(
              ['hiddenFields', 'calculateThresholdOnBackend'],
              f => f.setValue(true)
            )
          );

          websitesAlertingBlueprintChanged({ newBluePrint: alertType, mode: modeSimple });
        }}
        initialItemSelected={blueprintConfig}
        addRightSeparator
      />
      <AlertTypeSwitch
        alertType={alertType}
        renderJsErrors={() => (
          <SelectedBlueprintPresenter title={blueprintConfig.headline} description={blueprintConfig.text}>
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
        renderSlowness={() => <BlueprintDescription config={blueprintConfig} isSimpleMode />}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter title={blueprintConfig.headline} description={blueprintConfig.text}>
            <ProvideStatusCode form={form} onChange={onChange} updateForm={updateForm} mode={modeSimple} />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => <BlueprintDescription config={blueprintConfig} isSimpleMode />}
      />
      <SimpleAlertConfigDialogChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      />
    </SimpleModeStepContentWrapper>
  );
}
