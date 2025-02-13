/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';
import { Stack } from '@instana/components';

import { syntheticSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert.mless';

export interface CreateSmartAlertProps {
  testId?: string;
  isCarbonTableView?: boolean;
  withOutFloatingBtnMenu?: boolean;
}

export default function CreateSmartAlert({ testId, withOutFloatingBtnMenu = false }: CreateSmartAlertProps) {
  const { trackCta } = useSegmentTracking();
  const labelNew = t('in-alerting:smartAlerts.labelNew');
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const handleButtonClick = () => {
    trackCta(ALERTING_CREATE);
    addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
  };

  if (syntheticSmartAlertFullScreenDesignEnabled) {
    if (withOutFloatingBtnMenu) {
      return (
        <Stack align="end">
          <Button icon="lib_alerts_create" onClick={() => handleButtonClick()}>
            {t('in-alerting:smartAlerts.addSmartAlert')}
          </Button>
          <Button icon="lib_alerts_create" href={getLinkToCreateSmartAlert}>
            {`${t('in-alerting:smartAlerts.addSmartAlert')} ${labelNew}`}
          </Button>
        </Stack>
      );
    }
    return (
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          <Button icon="lib_alerts_create" onClick={() => handleButtonClick()}>
            {t('in-alerting:smartAlerts.addSmartAlert')}
          </Button>
          <Button icon="lib_alerts_create" href={getLinkToCreateSmartAlert}>
            {`${t('in-alerting:smartAlerts.addSmartAlert')} ${labelNew}`}
          </Button>
        </FloatingActionButtonMenu>
      </FloatingActionButtons>
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
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();

  const openOldDialog = () => {
    addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
  };

  const dialog =
    smartAlertCarbonTableEnabled && syntheticSmartAlertFullScreenDesignEnabled ? (
      <ViewSelectorDialog
        trackCta={trackCta}
        openOldDialog={openOldDialog}
        getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
      />
    ) : (
      <CreateSmartAlertDialog testId={testId} />
    );

  return (
    <Button kind="primaryv2" icon="lib_openclose_add" onClick={() => addActiveDialog(dialog)} size="xl">
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}
