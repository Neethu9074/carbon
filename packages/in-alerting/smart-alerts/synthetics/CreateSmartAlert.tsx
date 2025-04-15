/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import {
  syntheticSmartAlertFullScreenDesignEnabled,
  syntheticSmartAlertDialogViewEnabled
} from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { FULLSCREEN, SIMPLE, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert.mless';

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

export default function CreateSmartAlert({ testId, isListingPage, isFloatingMenu }: CreateSmartAlertProps) {
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

  if (isListingPage || isFloatingMenu) {
    return (
      <Button
        icon={isListingPage ? 'lib_openclose_add' : 'lib_alerts_create'}
        onClick={handleButtonClick}
        className={classNames({
          [locals.withShadow]: !isListingPage
        })}
        {...(isListingPage && { size: 'xl' })}
      >
        {isListingPage
          ? t('in-alerting:smartAlerts.createSmartAlert')
          : t('in-alerting:smartAlerts.synthetics.addSmartAlert')}
      </Button>
    );
  }
  return (
    <FloatingActionButton icon="lib_alerts_create" onClick={handleButtonClick} withBoxShadow>
      {t('in-alerting:smartAlerts.synthetics.addSmartAlert')}
    </FloatingActionButton>
  );
}
