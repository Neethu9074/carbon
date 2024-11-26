/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs,
  idFromBluePrint
} from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/websites/dialog/simple/SimpleAlertConfigDialogChart';
import { BlueprintDescription, BlueprintText } from 'in-alerting/smart-alerts/components/dialog/BlueprintDescription';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import createBlueprintForm from 'in-alerting/smart-alerts/websites/form/blueprintFormCreator';
import ProvideCustomEvent from 'in-alerting/smart-alerts/eum/components/ProvideCustomEvent';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import ProvideStatusCode from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode';
import ProvideJsError from 'in-alerting/smart-alerts/websites/components/ProvideJsError';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { eumType } from 'in-alerting/smart-alerts/websites/constants';
import SideRadioMenu from 'in-components/SideRadioMenu';
import { t } from 'in-i18n';

export default function SimpleAlertConfigDialogStep1({
  form,
  setSliderState,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  thresholdResult
}) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);
  const { headline, text } = blueprintConfig;

  return (
    <SimpleModeStepContentWrapper
      headline={t('in-alerting:smartAlerts.websites.simple.simpleAlertConfigDialogStep1Headline')}
    >
      <SideRadioMenu
        items={simpleModeBlueprintConfigs.map(x => ({ id: idFromBluePrint(x), name: x.name }))}
        onChange={bluePrintId => {
          const item = simpleModeBlueprintConfigs.find(i => bluePrintId === idFromBluePrint(i));
          updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, true));
        }}
        valueSelected={idFromBluePrint(blueprintConfig)}
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
            <ProvideStatusCode form={form} updateForm={updateForm} />
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
              eumType={eumType}
            />
          </SelectedBlueprintPresenter>
        )}
      />
      <SimpleAlertConfigDialogChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        thresholdResult={thresholdResult}
      />
    </SimpleModeStepContentWrapper>
  );
}
