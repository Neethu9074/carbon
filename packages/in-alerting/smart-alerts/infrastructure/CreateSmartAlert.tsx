/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/infrastructure/hooks/useSmartAlertCreateUrl';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/infrastructure/CreateSmartAlertDialog';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { infraSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

const labelNew = t('in-alerting:smartAlerts.labelNew');

export default function CreateSmartAlert() {
  const { trackCta } = useSegmentTracking();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();

  if (infraSmartAlertFullScreenDesignEnabled) {
    return (
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          <Button
            icon="lib_alerts_create"
            onClick={() => {
              trackCta(ALERTING_CREATE);
              addActiveDialog(<CreateSmartAlertDialog />);
            }}
          >
            {t('in-alerting:smartAlerts.addSmartAlert')}
          </Button>
          <Button
            icon="lib_alerts_create"
            onClick={() => {
              trackCta(ALERTING_CREATE);
            }}
            href={getLinkToCreateSmartAlert}
          >
            {`${t('in-alerting:smartAlerts.addSmartAlert')} ${labelNew}`}
          </Button>
        </FloatingActionButtonMenu>
      </FloatingActionButtons>
    );
  }
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
