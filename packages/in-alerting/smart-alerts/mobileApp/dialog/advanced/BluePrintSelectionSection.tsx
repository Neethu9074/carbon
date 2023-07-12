/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error
import BlueprintSelection from 'in-alerting/smart-alerts/components/dialog/advanced/BlueprintSelection';
import { MobileAlertType, blueprintConfigs } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { SliderState } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import createBlueprintForm from 'in-alerting/smart-alerts/mobileApp/form/blueprintFormCreator';
import ProvideCustomEvent from 'in-alerting/smart-alerts/eum/components/ProvideCustomEvent';
import AlertTypeSwitch from 'in-alerting/smart-alerts/mobileApp/components/AlertTypeSwitch';
import ProvideStatusCode from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { eumType } from 'in-alerting/smart-alerts/mobileApp/constants';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

interface BluePrintSelectionSectionProps {
  alertType: MobileAlertType;
  form: MapForm<any>;
  setSliderState: ({ slideInConfig, isVisible }: SliderState) => void;
  updateForm: (form: MapForm<any>) => void;
}

export default function BluePrintSelectionSection(props: BluePrintSelectionSectionProps) {
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
                windowSize: alertingDialogItemPickerTimeframe,
                autoRefresh: false
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
