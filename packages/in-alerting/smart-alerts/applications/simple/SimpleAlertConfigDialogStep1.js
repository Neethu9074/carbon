/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/applications/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-new-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import { applicationsAlertingBlueprintChanged } from 'in-alerting/smart-alerts/applications/tracker';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import Menu from 'in-alerting/components/Menu';
import { t } from 'in-i18n';

export default function SimpleAlertConfigDialogStep1({
  form,
  setLogMessagesListVisible,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);

  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.applications.simple.simpleAlertStep1Headline')}>
      <Menu
        items={simpleModeBlueprintConfigs}
        onItemClick={item => {
          updateForm(
            createBlueprintForm(form, item.type, item.thresholdDefaults).updateIn(
              ['hiddenFields', 'calculateThresholdOnBackend'],
              f => f.setValue(true)
            )
          );

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
