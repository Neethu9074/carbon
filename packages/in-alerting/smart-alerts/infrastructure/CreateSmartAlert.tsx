/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import CreateSmartAlertDialog from 'in-alerting/smart-alerts/infrastructure/CreateSmartAlertDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

export default function CreateSmartAlert() {
  const { trackCta } = useSegmentTracking();
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        trackCta(ALERTING_CREATE);
        addActiveDialog(<CreateSmartAlertDialog />);
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}
