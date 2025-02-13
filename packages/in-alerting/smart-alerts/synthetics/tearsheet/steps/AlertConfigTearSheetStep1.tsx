/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, Item } from 'formalistic';
import React from 'react';

import ConfigureAlertTest from 'in-alerting/smart-alerts/synthetics/tearsheet/components/ConfigureAlertTest';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { t } from 'in-i18n';

interface AlertConfigTearSheetStep1Props {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function AlertConfigTearSheetStep1({ form, onChange }: AlertConfigTearSheetStep1Props) {
  return (
    <TearSheetStepTitleWrapper
      headline={t('in-alerting:smartAlerts.synthetics.tearSheet.step1.header')}
      description={t('in-alerting:smartAlerts.synthetics.tearSheet.step1.description')}
      hideSpace
    >
      <ConfigureAlertTest form={form} onChange={onChange} numberOfAlertTestListRows={10} />
    </TearSheetStepTitleWrapper>
  );
}
