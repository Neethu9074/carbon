/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import TimeThresholdPicker from 'in-alerting/smart-alerts/synthetics/tearsheet/components/TimeThresholdPicker';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep2.mless';

interface AlertConfigTearSheetStep2Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function AlertConfigTearSheetStep2({ form, updateForm }: AlertConfigTearSheetStep2Props) {
  return (
    <div className={locals.container}>
      <TearSheetStepTitleWrapper
        headline={t('in-alerting:smartAlerts.synthetics.tearSheet.step2.sliderHeader')}
        description={t('in-alerting:smartAlerts.synthetics.tearSheet.step2.sliderDescription')}
      >
        <TimeThresholdPicker form={form} updateForm={updateForm} />
      </TearSheetStepTitleWrapper>
    </div>
  );
}
