/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import SimpleAlertConfigDialogChart from 'in-alerting/smart-alerts/applications/dialog/simple/SimpleAlertConfigDialogChart';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import { idFromBluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { smartAlertsLogsBlueprintEnabled } from 'in-services/featureFlags';
import SideRadioMenu from 'in-components/SideRadioMenu';
import { t } from 'in-i18n';

export default function SimpleAlertConfigDialogStep1({
  form,
  setLogMessagesListVisible,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  thresholdResult
}) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);
  const { headline, isBeta, text, type } = blueprintConfig;

  const blueprintConfigList =
    smartAlertsLogsBlueprintEnabled || type === 'logs'
      ? simpleModeBlueprintConfigs
      : simpleModeBlueprintConfigs.filter(config => config.type !== 'logs');

  return (
    <SimpleModeStepContentWrapper headline={t('in-alerting:smartAlerts.applications.tearSheet.alertHeadline')}>
      <SideRadioMenu
        items={blueprintConfigList.map(x => ({ id: idFromBluePrint(x), name: x.name }))}
        onChange={id => {
          const item = blueprintConfigList.find(i => id === idFromBluePrint(i));
          updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, true));
        }}
        valueSelected={idFromBluePrint(blueprintConfig)}
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderLogs={() => (
          <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta}>
            <ProvideLogMessage
              form={form}
              updateForm={updateForm}
              onSelectLogMessage={setLogMessagesListVisible}
              mode="Simple"
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
            />
          </SelectedBlueprintPresenter>
        )}
        renderSlowness={() => <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta} />}
        renderErrorRate={() => <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta} />}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter title={headline} description={text}>
            <ProvideStatusCode form={form} updateForm={updateForm} />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta} />}
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
