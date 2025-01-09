/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer } from '@instana/components';

import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import GracePeriod from 'in-alerting/smart-alerts/components/GracePeriod';
import { t } from 'in-i18n';

interface GracePeriodWrapperProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function GracePeriodWrapper({ form, updateForm }: GracePeriodWrapperProps) {
  return (
    <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.components.gracePeriod.title')} hideSpace>
      <Spacer size="xxsmall" />
      <GracePeriod form={form} updateForm={updateForm} />
    </TearSheetStepTitleWrapper>
  );
}
