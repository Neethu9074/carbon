/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs
} from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { BlueprintDescription } from 'in-alerting/smart-alerts/components/smart-alert-dialog/BlueprintDescription';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-new-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ProvideStatusCode from 'in-alerting/smart-alerts/websites/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/websites/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-alerting/smart-alerts/websites/tracker';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import ProvideJsError from 'in-alerting/smart-alerts/websites/components/ProvideJsError';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { modeSimple } from 'in-alerting/smart-alerts/websites/constants';
import Menu from 'in-alerting/components/Menu';
import { t } from 'in-i18n';

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
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.websites.simple.simpleAlertConfigDialogStep1Headline')}
    >
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
