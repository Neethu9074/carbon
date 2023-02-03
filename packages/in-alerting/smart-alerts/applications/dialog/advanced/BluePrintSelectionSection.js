/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import BlueprintSelection from 'in-alerting/smart-alerts/components/dialog/advanced/BlueprintSelection';
import { applicationsAlertingBlueprintChanged } from 'in-alerting/smart-alerts/applications/tracker';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

export default function BluePrintSelectionSection(props) {
  const { alertType, blueprintConfigList, form, setSliderState, updateForm } = props;

  return (
    <>
      <BlueprintSelection
        form={form}
        updateForm={updateForm}
        blueprintConfigs={blueprintConfigList}
        createBlueprintForm={createBlueprintForm}
        trackBlueprintChange={newBlueprint => applicationsAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })}
      />
      <AlertTypeSwitch
        alertType={alertType}
        renderLogs={() => (
          <LightCard
            title={t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.logMessageCardTitle')}
            withoutPadding
            darkFrame
          >
            <ProvideLogMessage
              form={form}
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
              updateForm={updateForm}
              onSelectLogMessage={setSliderState}
              mode="Advanced"
            />
          </LightCard>
        )}
        renderStatusCode={() => (
          <LightCard
            title={t(
              'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.httpStatusCodesCardTitle'
            )}
            withoutPadding
            darkFrame
          >
            <ProvideStatusCode form={form} updateForm={updateForm} mode="Advanced" />
          </LightCard>
        )}
      />
    </>
  );
}
