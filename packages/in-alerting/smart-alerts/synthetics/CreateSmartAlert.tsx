/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import {
  syntheticSmartAlertFullScreenDesignEnabled,
  syntheticSmartAlertDialogViewEnabled,
  smartAlertCarbonTableEnabled
} from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { FULLSCREEN, SIMPLE, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ADVANCED } from 'in-alerting/smart-alerts/data/constants';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert.mless';

export interface CreateSmartAlertProps {
  testId?: string;
  isCarbonTableView?: boolean;
}

const alertDisplayMode = getSmartAlertDisplayMode(
  syntheticSmartAlertDialogViewEnabled,
  syntheticSmartAlertFullScreenDesignEnabled
);

export default function CreateSmartAlert({ testId }: CreateSmartAlertProps) {
  const { trackCta } = useSegmentTracking();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({});

  const openCreateSmartAlertDialog = () => {
    addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
  };

  const handleButtonClick = () => {
    trackCta(ALERTING_CREATE, { dialogMode: SIMPLE });
    openCreateSmartAlertDialog();
  };

  if (syntheticSmartAlertFullScreenDesignEnabled) {
    return (
      <Button
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
      >
        {t('in-alerting:smartAlerts.synthetics.addSmartAlert')}
      </Button>
    );
  }

  return (
    <Button icon="lib_alerts_create" onClick={() => handleButtonClick()} className={locals.withShadow}>
      {t('in-alerting:smartAlerts.synthetics.addSmartAlert')}
    </Button>
  );
}

export function CreateSmartAlertButton({ testId }: CreateSmartAlertProps) {
  const { trackCta } = useSegmentTracking();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({});

  const openOldDialog = () => {
    addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
  };

  const getDialogComponent = () => {
    if (smartAlertCarbonTableEnabled && alertDisplayMode === CHOICE_DIALOG) {
      return (
        <ViewSelectorDialog
          trackCta={trackCta}
          openOldDialog={openOldDialog}
          getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
          mode={SIMPLE}
        />
      );
    } else {
      trackCta(ALERTING_CREATE, { dialogMode: SIMPLE });
      return <CreateSmartAlertDialog testId={testId} />;
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
