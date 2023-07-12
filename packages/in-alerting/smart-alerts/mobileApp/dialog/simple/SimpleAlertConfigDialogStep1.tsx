/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

//@ts-expect-error TS migration
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/mobileApp/dialog/simple/SimpleAlertConfigDialogChart';
import {
  BluePrint,
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs
} from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
//@ts-expect-error TS migration
import { BlueprintDescription } from 'in-alerting/smart-alerts/components/dialog/BlueprintDescription';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import createBlueprintForm from 'in-alerting/smart-alerts/mobileApp/form/blueprintFormCreator';
import { UpdateForm } from 'in-alerting/smart-alerts/mobileApp/dialog/simple/simpleModeSteps';
import ProvideCustomEvent from 'in-alerting/smart-alerts/eum/components/ProvideCustomEvent';
import AlertTypeSwitch from 'in-alerting/smart-alerts/mobileApp/components/AlertTypeSwitch';
import ProvideStatusCode from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { eumType } from 'in-alerting/smart-alerts/mobileApp/constants';
import Menu, { MenuItem } from 'in-components/Menu';
import { t } from 'in-i18n';

export default function SimpleAlertConfigDialogStep1({
  form,
  setSliderState,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}: AlertConfigDialogPresenterProps & MainDialogControl & UpdateForm) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);
  const { headline, text } = blueprintConfig as BluePrint;

  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.mobileApp.simple.simpleAlertConfigDialogStep1Headline')}
    >
      <Menu
        items={simpleModeBlueprintConfigs}
        onItemClick={item => {
          updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, true));
        }}
        initialItemSelected={blueprintConfig as MenuItem}
        addRightSeparator
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter title={headline ?? ''} description={text}>
            <ProvideStatusCode form={form} updateForm={updateForm} />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => <BlueprintDescription config={blueprintConfig} isSimpleMode />}
        renderCustomEvent={() => (
          <SelectedBlueprintPresenter title={headline ?? ''} description={text}>
            <ProvideCustomEvent
              form={form}
              updateForm={updateForm}
              onSelectCustomEvent={setSliderState}
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe,
                autoRefresh: false
              }}
              mode="Simple"
              eumType={eumType}
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
