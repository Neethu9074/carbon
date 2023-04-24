/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import BlueprintSelection from 'in-alerting/smart-alerts/components/dialog/advanced/BlueprintSelection';
import ProvideCustomEvent from 'in-alerting/smart-alerts/websites/components/ProvideCustomEvent';
import ProvideStatusCode from 'in-alerting/smart-alerts/websites/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/websites/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import { blueprintConfigs } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import ProvideJsError from 'in-alerting/smart-alerts/websites/components/ProvideJsError';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
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
        renderJsErrors={() => (
          <LightCard title={t('in-alerting:smartAlerts.websites.advanced.JSErrorMessage')} withoutPadding darkFrame>
            <ProvideJsError
              form={form}
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
              updateForm={updateForm}
              onSelectJsError={setSliderState}
              mode="Advanced"
            />
          </LightCard>
        )}
        renderStatusCode={() => (
          <LightCard title={t('in-alerting:smartAlerts.websites.advanced.HTTPStatusCode')} withoutPadding darkFrame>
            <ProvideStatusCode form={form} updateForm={updateForm} />
          </LightCard>
        )}
        renderCustomEvent={() => (
          <LightCard
            title={t('in-alerting:smartAlerts.websites.customEvent.customEventLabel')}
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
            />
          </LightCard>
        )}
      />
    </>
  );
}
