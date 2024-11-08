/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import TearSheetStepContentWrapper from 'in-alerting/components/TearSheetStepContentWrapper';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep4() {
  return (
    <TearSheetStepContentWrapper
      headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.step4.header')}
      description={t('in-alerting:smartAlerts.infrastructure.tearSheet.step4.description')}
    />
  );
}
