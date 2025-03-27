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
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

const alertDisplayMode = getSmartAlertDisplayMode(logSmartAlertDialogViewEnabled, logSmartAlertFullScreenDesignEnabled);

export default function CreateSmartAlert({ isListingPage }: { isListingPage?: boolean }) {
  const { trackCta } = useSegmentTracking();
  const { goToPath } = useNavigation();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({});

  const handleButtonClick = () => {
    if (alertDisplayMode === CHOICE_DIALOG) {
      addActiveDialog(
        <ViewSelectorDialog
          trackCta={trackCta}
          openOldDialog={() => addActiveDialog(<CreateSmartAlertDialog />)}
          getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
          mode={ADVANCED}
        />
      );
      return;
    }
    if (alertDisplayMode === FULLSCREEN) {
      trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN });
      goToPath(getLinkToCreateSmartAlert.slice(2));
      return;
    }
    trackCta(ALERTING_CREATE, { dialogMode: ADVANCED });
    return addActiveDialog(<CreateSmartAlertDialog />);
  };

  if (smartAlertCarbonTableEnabled && isListingPage) {
    return (
      <Button kind="primaryv2" icon="lib_openclose_add" onClick={handleButtonClick}>
        {t('in-alerting:smartAlerts.createSmartAlert')}
      </Button>
    );
  }

  return (
    <FloatingActionButton icon="lib_alerts_create" onClick={handleButtonClick} withBoxShadow>
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}
