/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { logSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/logs/hooks/useSmartAlertCreateUrl';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/logs/CreateSmartAlertDialog';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ADVANCED } from 'in-alerting/smart-alerts/data/constants';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

export default function CreateSmartAlert() {
  const { trackCta } = useSegmentTracking();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({});

  const openCreateSmartAlertDialog = () => {
    addActiveDialog(<CreateSmartAlertDialog />);
  };

  const handleFloatingButtonClick = () => {
    trackCta(ALERTING_CREATE, { dialogMode: ADVANCED });
    openCreateSmartAlertDialog();
  };

  if (logSmartAlertFullScreenDesignEnabled) {
    return (
      <FloatingActionButton
        icon="lib_alerts_create"
        onClick={() =>
          addActiveDialog(
            <ViewSelectorDialog
              trackCta={trackCta}
              openOldDialog={openCreateSmartAlertDialog}
              getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
              mode={ADVANCED}
            />
          )
        }
        withBoxShadow
      >
        {t('in-alerting:smartAlerts.addSmartAlert')}
      </FloatingActionButton>
    );
  }

  return (
    <FloatingActionButton icon="lib_alerts_create" onClick={handleFloatingButtonClick} withBoxShadow>
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
        mode={ADVANCED}
      />
    ) : (
      <CreateSmartAlertDialog />
    );

  return (
    <Button
      kind="primaryv2"
      icon="lib_openclose_add"
      onClick={() => {
        trackCta(ALERTING_CREATE, { dialogMode: ADVANCED });
        addActiveDialog(dialog);
      }}
      size="xl"
    >
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}
