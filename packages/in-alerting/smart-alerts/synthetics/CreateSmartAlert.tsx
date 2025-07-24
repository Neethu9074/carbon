/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import {
  syntheticSmartAlertDialogViewEnabled,
  syntheticSmartAlertFullScreenDesignEnabled
} from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { CHOICE_DIALOG, FULLSCREEN, SIMPLE } from 'in-alerting/smart-alerts/data/constants';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

export interface CreateSmartAlertProps {
  testId?: string;
  isCarbonTableView?: boolean;
  isListingPage?: boolean;
  isFloatingMenu?: boolean;
}

const alertDisplayMode = getSmartAlertDisplayMode(
  syntheticSmartAlertDialogViewEnabled,
  syntheticSmartAlertFullScreenDesignEnabled
);

export default function CreateSmartAlert({ testId }: CreateSmartAlertProps) {
  const { trackCta } = useSegmentTracking();
  const { goToPath } = useNavigation();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({});

  const openCreateSmartAlertDialog = () => {
    addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
  };

  const handleButtonClick = () => {
    if (alertDisplayMode === CHOICE_DIALOG) {
      addActiveDialog(
        <ViewSelectorDialog
          trackCta={trackCta}
          openOldDialog={openCreateSmartAlertDialog}
          getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
          mode={SIMPLE}
        />
      );
      return;
    }
    if (alertDisplayMode === FULLSCREEN) {
      trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN });
      goToPath(getLinkToCreateSmartAlert.slice(2));
      return;
    }
    trackCta(ALERTING_CREATE, { dialogMode: SIMPLE });
    openCreateSmartAlertDialog();
  };

  return (
    <Button icon={'lib_openclose_add'} onClick={handleButtonClick} size="xl">
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}
