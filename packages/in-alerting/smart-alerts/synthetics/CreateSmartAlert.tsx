/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

export interface CreateSmartAlertProps {
  testId?: string;
  isCarbonTableView?: boolean;
}

export default function CreateSmartAlert({ testId, isCarbonTableView }: CreateSmartAlertProps) {
  const { trackCta } = useSegmentTracking();
  const handleButtonClick = () => {
    trackCta(ALERTING_CREATE);
    addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
  };

  if (isCarbonTableView) {
    return (
      <Button icon="lib_openclose_add" onClick={() => handleButtonClick()} size="xl">
        {t('in-alerting:smartAlerts.createSmartAlert')}
      </Button>
    );
  } else {
    return (
      <FloatingActionButton icon="lib_alerts_create" onClick={() => handleButtonClick()} withBoxShadow>
        {t('in-alerting:smartAlerts.synthetics.addSmartAlert')}
      </FloatingActionButton>
    );
  }
}
