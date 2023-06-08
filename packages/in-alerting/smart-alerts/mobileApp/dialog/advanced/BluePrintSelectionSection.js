/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import BlueprintSelection from 'in-alerting/smart-alerts/components/dialog/advanced/BlueprintSelection';
import createBlueprintForm from 'in-alerting/smart-alerts/mobileApp/form/blueprintFormCreator';
import ProvideCustomEvent from 'in-alerting/smart-alerts/eum/components/ProvideCustomEvent';
import AlertTypeSwitch from 'in-alerting/smart-alerts/mobileApp/components/AlertTypeSwitch';
import { blueprintConfigs } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import ProvideStatusCode from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { eumType } from 'in-alerting/smart-alerts/mobileApp/constants';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

export default function BluePrintSelectionSection(props) {
  const { alertType, form, setSliderState, updateForm } = props;

  return (
    <>
      <BlueprintSelection
        form={form}
        updateForm={updateForm}
        blueprintConfigs={blueprintConfigs}
        createBlueprintForm={createBlueprintForm}
      />
      <AlertTypeSwitch
        alertType={alertType}
        renderStatusCode={() => (
          <LightCard title={t('in-alerting:smartAlerts.mobileApp.advanced.HTTPStatusCode')} withoutPadding darkFrame>
            <ProvideStatusCode form={form} updateForm={updateForm} />
          </LightCard>
        )}
        renderCustomEvent={() => (
          <LightCard
            title={t('in-alerting:smartAlerts.mobileApp.customEvent.customEventLabel')}
            withoutPadding
            darkFrame
          >
            <ProvideCustomEvent
              form={form}
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
              updateForm={updateForm}
              onSelectCustomEvent={setSliderState}
              mode="Advanced"
              eumType={eumType}
            />
          </LightCard>
        )}
      />
    </>
  );
}
