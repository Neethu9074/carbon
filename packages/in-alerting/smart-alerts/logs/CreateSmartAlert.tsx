/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import {
  logSmartAlertFullScreenDesignEnabled,
  logSmartAlertDialogViewEnabled,
  smartAlertCarbonTableEnabled
} from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/logs/hooks/useSmartAlertCreateUrl';
import { ADVANCED, FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/logs/CreateSmartAlertDialog';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

const alertDisplayMode = getSmartAlertDisplayMode(logSmartAlertDialogViewEnabled, logSmartAlertFullScreenDesignEnabled);

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

  const getDialogComponent = () => {
    if (smartAlertCarbonTableEnabled && alertDisplayMode === CHOICE_DIALOG) {
      return (
        <ViewSelectorDialog
          trackCta={trackCta}
          openOldDialog={openOldDialog}
          getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
          mode={ADVANCED}
        />
      );
    } else {
      trackCta(ALERTING_CREATE, { dialogMode: ADVANCED });
      return <CreateSmartAlertDialog />;
    }
  };

  if (alertDisplayMode === FULLSCREEN) {
    return (
      <Button
        kind="primaryv2"
        icon="lib_openclose_add"
        href={getLinkToCreateSmartAlert}
        onClick={() => trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN })}
      >
        {t('in-alerting:smartAlerts.createSmartAlert')}
      </Button>
    );
  }

  return (
    <Button kind="primaryv2" icon="lib_openclose_add" onClick={() => addActiveDialog(getDialogComponent())} size="xl">
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}
