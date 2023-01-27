/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs
} from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { BlueprintDescription, BlueprintText } from 'in-alerting/smart-alerts/components/dialog/BlueprintDescription';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/websites/dialog/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ProvideCustomEvent from 'in-alerting/smart-alerts/websites/components/ProvideCustomEvent';
import ProvideStatusCode from 'in-alerting/smart-alerts/websites/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/websites/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-alerting/smart-alerts/websites/tracker';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import ProvideJsError from 'in-alerting/smart-alerts/websites/components/ProvideJsError';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import Menu from 'in-components/Menu';
import { t } from 'in-i18n';

export default function SimpleAlertConfigDialogStep1({
  form,
  setSliderState,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);
  const { headline, text } = blueprintConfig;

  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.websites.simple.simpleAlertConfigDialogStep1Headline')}
    >
      <Menu
        items={simpleModeBlueprintConfigs}
        onItemClick={item => {
          updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, true));

          websitesAlertingBlueprintChanged({ newBluePrint: alertType, mode: 'Simple' });
        }}
        initialItemSelected={blueprintConfig}
        addRightSeparator
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderJsErrors={() => (
          <SelectedBlueprintPresenter title={headline} description={text}>
            <ProvideJsError
              form={form}
              updateForm={updateForm}
              onSelectJsError={setSliderState}
              mode="Simple"
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
            />
          </SelectedBlueprintPresenter>
        )}
        renderSlowness={() => (
          <SelectedBlueprintPresenter title={headline}>
            <BlueprintText config={{ text }} />
          </SelectedBlueprintPresenter>
        )}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter title={headline} description={text}>
            <ProvideStatusCode form={form} updateForm={updateForm} mode="Simple" />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => <BlueprintDescription config={blueprintConfig} isSimpleMode />}
        renderCustomEvent={() => (
          <SelectedBlueprintPresenter title={headline} description={text}>
            <ProvideCustomEvent
              form={form}
              updateForm={updateForm}
              onSelectCustomEvent={setSliderState}
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
              mode="Simple"
            />
          </SelectedBlueprintPresenter>
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
