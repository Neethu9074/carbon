/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
//@ts-expect-error
import BluePrintSelectionSection from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/BluePrintSelectionSection';
import StepsContainer from 'in-components/StepsContainer';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const { form, onChange, setSliderState, updateForm, setCustomSlideInHeaderConfig } = props;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;

  return (
    <StepsContainer
      messages={[]}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.triggerLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.triggerTitle'),
          valid: true,
          content: (
            <>
              <BluePrintSelectionSection
                alertType={alertType}
                form={form}
                updateForm={updateForm}
                setSliderState={setSliderState}
              />
            </>
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.alertChannelsLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.alertChannelsTitle'),
          valid: true,
          content: (
            <ConfigureAlertChannel
              form={form}
              onChange={onChange}
              setSliderState={setSliderState}
              setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
              numberOfAlertChannelListRows={7}
            />
          )
        }
      ]}
    />
  );
}
