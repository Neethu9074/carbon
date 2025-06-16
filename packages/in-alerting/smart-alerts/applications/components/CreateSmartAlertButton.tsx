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
import {
  applicationSmartAlertFullScreenDesignEnabled,
  applicationSmartAlertDialogView
} from 'in-services/featureFlags';
//@ts-expect-errors
import { generateAlertConfig } from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
//@ts-expect-errors
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { ADVANCED, FULLSCREEN, SIMPLE, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { alertsList, alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { events } from 'in-settings/navigation/paths';
import { Location } from 'in-stores/navigation/types';

import locals from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton.mless';

const alertDisplayMode = getSmartAlertDisplayMode(
  applicationSmartAlertDialogView,
  applicationSmartAlertFullScreenDesignEnabled
);

// used in case of SA Migration
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
          trackCta(APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED, {
            eventSpecificationId,
            dialogMode: FULLSCREEN
          });
        } else {
          trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN });
        }
      }}
    >
      {buttonName}
    </Button>
  );
}

// this function is to display view selector dialog when carbon table is enabled
export function CreateSmartAlertButtonForCarbonTable({
  isGlobal,
  renderAsSimpleButton,
  buttonName,
  isFloatingButton,
  location
}: {
  isGlobal: boolean;
  renderAsSimpleButton?: boolean;
  buttonName: string;
  isFloatingButton?: boolean;
  location: Location;
}) {
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

          if (
            location?.pathname === alertsTabListFullyQualified ||
            location?.pathname === alertsList ||
            location?.pathname === events
          ) {
            refreshSmartAlertConfigsList();
          }
        }}
      />
    );
  };

  return (
    <CarbonTableCreateButton
      openOldDialog={openOldDialog}
      createSmartAlertPath={createSmartAlertPath}
      isGlobal={isGlobal}
      renderAsSimpleButton={renderAsSimpleButton}
      buttonName={buttonName}
      isFloatingButton={isFloatingButton}
    />
  );
}

export function CarbonTableCreateButton({
  openOldDialog,
  createSmartAlertPath,
  isGlobal,
  renderAsSimpleButton,
  buttonName,
  isFloatingButton
}: {
  openOldDialog: VoidFunction;
  createSmartAlertPath: string;
  isGlobal: boolean;
  renderAsSimpleButton?: boolean;
  buttonName: string;
  isFloatingButton?: boolean;
}) {
  const { trackCta } = useSegmentTracking();
  const { goToPath } = useNavigation();

  const handleButtonClick = () => {
    if (alertDisplayMode === CHOICE_DIALOG) {
      addActiveDialog(
        <ViewSelectorDialog
          trackCta={trackCta}
          openOldDialog={openOldDialog}
          getLinkToCreateSmartAlert={createSmartAlertPath}
          mode={isGlobal ? ADVANCED : SIMPLE}
        />
      );
      return;
    }
    if (alertDisplayMode === FULLSCREEN) {
      trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN });
      goToPath(createSmartAlertPath.slice(2));
      return;
    }

    openOldDialog();
    trackCta(ALERTING_CREATE, { dialogMode: isGlobal ? ADVANCED : SIMPLE });
  };

  if (renderAsSimpleButton) {
    return (
      <FloatingActionButton icon="lib_alerts_create" kind={'primaryv2'} onClick={handleButtonClick}>
        {buttonName}
      </FloatingActionButton>
    );
  }

  return (
    <Button
      kind="primaryv2"
      icon={isFloatingButton ? 'lib_alerts_create' : 'lib_openclose_add'}
      onClick={handleButtonClick}
      size={isFloatingButton ? 'normal' : 'xl'}
    >
      {buttonName}
    </Button>
  );
}
