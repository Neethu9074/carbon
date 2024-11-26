/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer } from '@instana/components';

import SelectedBlueprintPresenter from 'in-alerting/smart-alerts/components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/tearSheet/components/LogMessages/ProvideLogMessage';
import LogMessages from 'in-alerting/smart-alerts/applications/tearSheet/components/LogMessages/LogMessages';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import { blueprintConfigs } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Menu from 'in-alerting/smart-alerts/components/Menu';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep1({ form, updateForm, blueprintConfigList }) {
  const alertType = form.get('rule').get('alertType').value;
  const blueprintConfig = blueprintConfigs.find(item => item.type === alertType);
  const { tearSheetHeadline, isBeta, tearSheetDescription } = blueprintConfig;

  return (
    <TearSheetStepContentWrapper headline={t('in-alerting:smartAlerts.applications.tearSheet.alertHeadline')}>
      <Menu
        items={blueprintConfigList}
        onItemClick={item => {
          updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, false));
        }}
        initialItemSelected={blueprintConfig}
        direction="horizontal"
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderLogs={() => (
          <SelectedBlueprintPresenter title={tearSheetHeadline} description={tearSheetDescription} isBeta={false}>
            <Spacer vertical="normal" />
            <ExpandableLightCard
              title={
                <AlertTypography
                  variant="heading-100"
                  content={t('in-alerting:smartAlerts.applications.logMessages.messageColumn')}
                />
              }
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
        renderSlowness={() => (
          <SelectedBlueprintPresenter title={tearSheetHeadline} description={tearSheetDescription} isBeta={isBeta} />
        )}
        renderErrorRate={() => (
          <SelectedBlueprintPresenter title={tearSheetHeadline} description={tearSheetDescription} isBeta={isBeta} />
        )}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter title={tearSheetHeadline} description={tearSheetDescription}>
            <ProvideStatusCode form={form} updateForm={updateForm} tearSheetView />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => (
          <SelectedBlueprintPresenter title={tearSheetHeadline} description={tearSheetDescription} isBeta={isBeta} />
        )}
      />
    </TearSheetStepContentWrapper>
  );
}
