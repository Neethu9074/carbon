/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertChannel';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep4({
  form,
  onChange
}: {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}) {
  return (
    <TearSheetStepTitleWrapper
      headline={t('in-alerting:smartAlerts.logs.tearSheet.step4.header')}
      description={t('in-alerting:smartAlerts.logs.tearSheet.step4.description')}
      hideSpace
    >
      <ConfigureAlertChannel form={form} onChange={onChange} numberOfAlertChannelListRows={10} />
    </TearSheetStepTitleWrapper>
  );
}
