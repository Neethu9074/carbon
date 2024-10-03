/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm, MapPath } from 'formalistic';
import React from 'react';

//@ts-expect-error
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel';
import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep6({
  form,
  onChange
}: {
  form: MapForm<any>;
  onChange: (path: MapPath<any>, updater: (item: Item) => Item) => void;
}) {
  return (
    <>
      <TearSheetStepContentWrapper
        headline={t('in-alerting:smartAlerts.applications.tearSheet.AlertChannelTitle')}
        description={t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.description')}
      >
        <ConfigureAlertChannel form={form} onChange={onChange} numberOfAlertChannelListRows={10} />
      </TearSheetStepContentWrapper>
    </>
  );
}
