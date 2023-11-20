/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import FloatingActionButton from 'in-components/FloatingActionButton';
import { t } from 'in-i18n';

export default function CreateSmartAlert() {
  return (
    <FloatingActionButton icon="lib_alerts_create" onClick={() => {}} withBoxShadow>
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}
