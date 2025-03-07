/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { logSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/logs/hooks/useSmartAlertCreateUrl';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/logs/CreateSmartAlertDialog';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

export default function CreateSmartAlert() {
  const { trackCta } = useSegmentTracking();
  const labelNew = t('in-alerting:smartAlerts.labelNew');
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({});

  const handleButtonClick = () => {
    trackCta(ALERTING_CREATE);
    addActiveDialog(<CreateSmartAlertDialog />);
  };

  if (logSmartAlertFullScreenDesignEnabled) {
    return (
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          <Button icon="lib_alerts_create" onClick={() => handleButtonClick()}>
            {t('in-alerting:smartAlerts.addSmartAlert')}
          </Button>
          <Button icon="lib_alerts_create" href={getLinkToCreateSmartAlert} onClick={() => trackCta(ALERTING_CREATE)}>
            {`${t('in-alerting:smartAlerts.addSmartAlert')} ${labelNew}`}
          </Button>
        </FloatingActionButtonMenu>
      </FloatingActionButtons>
    );
  }

  return (
    <FloatingActionButton icon="lib_alerts_create" onClick={() => handleButtonClick()} withBoxShadow>
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}

export function CreateSmartAlertButton() {
  const { trackCta } = useSegmentTracking();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({});

  const openOldDialog = () => {
    addActiveDialog(<CreateSmartAlertDialog />);
  };

  const dialog =
    smartAlertCarbonTableEnabled && logSmartAlertFullScreenDesignEnabled ? (
      <ViewSelectorDialog
        trackCta={trackCta}
        openOldDialog={openOldDialog}
        getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
      />
    ) : (
      <CreateSmartAlertDialog />
    );

  return (
    <Button kind="primaryv2" icon="lib_openclose_add" onClick={() => addActiveDialog(dialog)} size="xl">
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}
