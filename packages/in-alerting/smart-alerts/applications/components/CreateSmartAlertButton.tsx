/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';

import {
  ALERTING_CREATE,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED
} from 'in-services/tracking/eventNames';
//@ts-expect-errors
import { generateAlertConfig } from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import { applicationSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
//@ts-expect-errors
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { isDialogAndTearSheetEnabled } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { alertsList, alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton.mless';

const showDialogAndTearSheetButton = isDialogAndTearSheetEnabled();

export default function CreateSmartAlertButton({
  isGlobal,
  buttonName,
  isMigrate = false,
  boundaryScope,
  defaultBoundaryScope,
  serviceId,
  applicationId,
  endpointId,
  eventSpecificationId,
  renderAsSimpleButton = false
}: {
  isGlobal: boolean;
  buttonName: string;
  isMigrate?: boolean;
  boundaryScope?: string;
  defaultBoundaryScope?: string;
  serviceId?: string;
  applicationId?: string;
  endpointId?: string;
  eventSpecificationId?: string;
  renderAsSimpleButton?: boolean;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const createSmartAlertPath = getLinkToCreateSmartAlert({
    isGlobal: isGlobal,
    migration: isMigrate,
    boundaryScope: boundaryScope || defaultBoundaryScope,
    serviceId: serviceId,
    applicationId: applicationId,
    endpointId: endpointId,
    eventSpecificationId: eventSpecificationId
  });
  const { trackCta } = useSegmentTracking();

  return (
    <Button
      className={classNames({
        [locals.button]: renderAsSimpleButton
      })}
      icon="lib_alerts_create"
      kind={'primaryv2'}
      href={createSmartAlertPath}
      onClick={() => {
        if (isMigrate) {
          trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED, { eventSpecificationId });
        } else {
          trackCta(ALERTING_CREATE);
        }
      }}
    >
      {buttonName}
    </Button>
  );
}

// this function is to display view selector dialog when carbon table is enabled
export function CreateSmartAlertButtonForCarbonTable({ isGlobal }: { isGlobal: boolean }) {
  const { trackCta } = useSegmentTracking();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const createSmartAlertPath = getLinkToCreateSmartAlert({
    isGlobal: isGlobal
  });

  const openOldDialog = () => {
    addActiveDialog(
      <AlertConfigDialog
        isGlobalSmartAlert
        alertConfig={generateAlertConfig()}
        onClose={() => {
          close();

          if (location?.pathname === alertsTabListFullyQualified || location?.pathname === alertsList) {
            refreshSmartAlertConfigsList();
          }
        }}
      />
    );
  };

  return getButtonActions(trackCta, openOldDialog, createSmartAlertPath);
}

export function getButtonActions(
  trackCta: CtaTrackingFunction,
  openOldDialog: VoidFunction,
  createSmartAlertPath: string
) {
  if (smartAlertCarbonTableEnabled && showDialogAndTearSheetButton) {
    return (
      <Button
        kind="primaryv2"
        icon="lib_openclose_add"
        onClick={() =>
          addActiveDialog(
            <ViewSelectorDialog
              trackCta={trackCta}
              openOldDialog={openOldDialog}
              getLinkToCreateSmartAlert={createSmartAlertPath}
            />
          )
        }
        size="xl"
      >
        {t('in-alerting:smartAlerts.createSmartAlert')}
      </Button>
    );
  } else if (applicationSmartAlertFullScreenDesignEnabled) {
    return (
      <Button
        kind="primaryv2"
        icon="lib_openclose_add"
        href={createSmartAlertPath}
        onClick={() => trackCta(ALERTING_CREATE)}
        size="xl"
      >
        {t('in-alerting:smartAlerts.createSmartAlert')}
      </Button>
    );
  }
  return (
    <Button
      kind="primaryv2"
      icon="lib_openclose_add"
      onClick={() => {
        openOldDialog();
        trackCta(ALERTING_CREATE);
      }}
      size="xl"
    >
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}
