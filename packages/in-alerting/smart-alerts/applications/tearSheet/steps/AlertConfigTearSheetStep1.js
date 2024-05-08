/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  getSimpleModeBlueprintConfig,
  simpleModeBlueprintConfigs
} from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/tearSheet/components/LogMessages/ProvideLogMessage';
import LogMessages from 'in-alerting/smart-alerts/applications/tearSheet/components/LogMessages/LogMessages';
import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { smartAlertsLogsBlueprintEnabled } from 'in-services/featureFlags';
import Menu from 'in-components/Menu';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep1.mless';

export default function AlertConfigTearSheetStep1({ form, updateForm }) {
  const alertType = form.get('rule').get('alertType').value;

  const alertThreshold = form.get('threshold').toJS();
  const blueprintConfig = getSimpleModeBlueprintConfig(alertType, alertThreshold);
  const { headline, isBeta, text, type } = blueprintConfig;

  const blueprintConfigList =
    smartAlertsLogsBlueprintEnabled || type === 'logs'
      ? simpleModeBlueprintConfigs
      : simpleModeBlueprintConfigs.filter(config => config.type !== 'logs');

  return (
    <TearSheetStepContentWrapper headline={t('in-alerting:smartAlerts.applications.simple.simpleAlertStep1Headline')}>
      <div className={locals.container}>
        <Menu
          items={blueprintConfigList}
          onItemClick={item => {
            updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, false));
          }}
          initialItemSelected={blueprintConfig}
          addRightSeparator
        />

        <AlertTypeSwitch
          alertType={alertType}
          blueprintConfig={blueprintConfig}
          renderLogs={() => (
            <SelectedBlueprintPresenter title={headline} description={text} isBeta={isBeta}>
              <ExpandableLightCard
                title={t('in-alerting:smartAlerts.applications.logMessages.messageColumn')}
                useMaxAvailableHeight={false}
                openByDefault
                darkFrame
              >
                <LogMessages
                  form={form}
                  updateForm={updateForm}
                  timeConfig={{
                    windowSize: alertingDialogItemPickerTimeframe
                  }}
                />

                <ProvideLogMessage
                  form={form}
                  updateForm={updateForm}
                  mode="Simple"
                  timeConfig={{
                    windowSize: alertingDialogItemPickerTimeframe
                  }}
                />
              </ExpandableLightCard>
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
      </div>
    </TearSheetStepContentWrapper>
  );
}
