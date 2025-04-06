/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import ConfigureAlertChannelMT from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
//@ts-expect-error
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { alertChannelPerSeverityMobileAppSaEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep5({
  form,
  onChange,
  updateForm
}: {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  updateForm: (form: MapForm<any>) => void;
}) {
  return (
    <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.mobileApp.tearSheet.step5.description')} hideSpace>
      {alertChannelPerSeverityMobileAppSaEnabled ? (
        <ConfigureAlertChannelMT
          form={form}
          onChange={onChange}
          updateForm={updateForm}
          numberOfAlertChannelListRows={10}
          isTearSheet
          alertChannelPerSeverityEnabled={alertChannelPerSeverityMobileAppSaEnabled}
        />
      ) : (
        <ConfigureAlertChannel form={form} onChange={onChange} numberOfAlertChannelListRows={10} />
      )}
    </TearSheetStepTitleWrapper>
  );
}
