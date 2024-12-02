/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm, MapPath } from 'formalistic';
import React from 'react';

import ConfigureAlertChannelMT from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
//@ts-expect-error
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { alertChannelPerSeverityApplicationSaEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep6({
  form,
  updateForm,
  onChange
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: MapPath<any>, updater: (item: Item) => Item) => void;
}) {
  return (
    <>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.AlertChannelTitle')}
        description={t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.description')}
      >
        <>
          {alertChannelPerSeverityApplicationSaEnabled ? (
            <ConfigureAlertChannelMT
              form={form}
              onChange={onChange}
              updateForm={updateForm}
              numberOfAlertChannelListRows={10}
              isTearSheet
              alertChannelPerSeverityEnabled={alertChannelPerSeverityApplicationSaEnabled}
            />
          ) : (
            <ConfigureAlertChannel form={form} onChange={onChange} numberOfAlertChannelListRows={10} />
          )}
        </>
      </TearSheetStepContentWrapper>
    </>
  );
}
