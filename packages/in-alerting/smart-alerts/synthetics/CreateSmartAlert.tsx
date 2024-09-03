/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

export interface CreateSmartAlertProps {
  testId?: string;
}

export default function CreateSmartAlert({ testId }: CreateSmartAlertProps) {
  const { trackCta } = useSegmentTracking();
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        trackCta(ALERTING_CREATE);
        addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.synthetics.addSmartAlert')}
    </FloatingActionButton>
  );
}
