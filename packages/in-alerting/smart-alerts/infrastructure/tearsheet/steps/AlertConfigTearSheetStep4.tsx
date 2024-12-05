/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import ConfigureAlertChannelMT from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
//@ts-expect-error
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { alertChannelPerSeverityInfraSaEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep4({
  form,
  updateForm,
  onChange
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}) {
  return (
    <TearSheetStepContentWrapper
      headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.step4.header')}
      description={t('in-alerting:smartAlerts.infrastructure.tearSheet.step4.description')}
    >
      {alertChannelPerSeverityInfraSaEnabled ? (
        <ConfigureAlertChannelMT
          form={form}
          onChange={onChange}
          updateForm={updateForm}
          numberOfAlertChannelListRows={10}
          isTearSheet
          alertChannelPerSeverityEnabled={alertChannelPerSeverityInfraSaEnabled}
        />
      ) : (
        <ConfigureAlertChannel form={form} onChange={onChange} numberOfAlertChannelListRows={10} />
      )}
    </TearSheetStepContentWrapper>
  );
}
