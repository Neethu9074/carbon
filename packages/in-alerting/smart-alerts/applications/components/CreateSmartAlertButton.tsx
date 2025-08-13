/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Button } from '@instana/components';

//@ts-expect-error
import { generateAlertConfig as generateGlobalAlertConfig } from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import {
  ALERTING_CREATE,
  APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED
} from 'in-services/tracking/eventNames';
//@ts-expect-errors
import { generateAlertConfig } from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import {
  applicationSmartAlertDialogView,
  applicationSmartAlertFullScreenDesignEnabled
} from 'in-services/featureFlags';
import { generateAlertConfig as generateAlertConfigForLocal } from 'in-alerting/smart-alerts/applications/CreateSmartAlert';
// @ts-expect-error
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import ApplicationEntitySection from 'in-alerting/smart-alerts/applications/components/ApplicationEntitySection';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { ADVANCED, CHOICE_DIALOG, FULLSCREEN, SIMPLE } from 'in-alerting/smart-alerts/data/constants';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { alertsList, alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
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
  buttonName,
  location
}: {
  isGlobal: boolean;
  buttonName: string;
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
      buttonName={buttonName}
    />
  );
}

export function CarbonTableCreateButton({
  openOldDialog,
  createSmartAlertPath,
  isGlobal,
  buttonName
}: {
  openOldDialog: VoidFunction;
  createSmartAlertPath: string;
  isGlobal: boolean;
  buttonName: string;
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

  return (
    <Button kind="primaryv2" icon="lib_openclose_add" onClick={handleButtonClick} size="xl">
      {buttonName}
    </Button>
  );
}

export function CreateSmartAlertFormEvents({
  isGlobal,
  buttonName,
  location
}: {
  isGlobal: boolean;
  buttonName: string;
  location: Location;
}) {
  const { trackCta } = useSegmentTracking();
  const { goToPath } = useNavigation();
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const [selectedApplicationId, setSelectedApplicationId] = useState('');

  const createSmartAlertPath = getLinkToCreateSmartAlert({
    isGlobal: isGlobal,
    applicationId: !isGlobal ? selectedApplicationId : ''
  });

  useEffect(() => {
    if (selectedApplicationId) {
      handleButtonClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplicationId]);

  const handleSelectedApplication = (id: string) => {
    setSelectedApplicationId(id);
  };

  const handleApplicationSelection = () => {
    setSelectedApplicationId('');
    addActiveDialog(
      <ApplicationEntitySection
        handleSelectedApplication={handleSelectedApplication as (id: string | undefined) => void}
      />
    );
  };

  const openOldDialog = () => {
    addActiveDialog(
      <AlertConfigDialog
        isGlobalSmartAlert={isGlobal}
        startWithSimpleMode={!isGlobal}
        alertConfig={
          isGlobal
            ? generateGlobalAlertConfig()
            : generateAlertConfigForLocal({
                applicationId: selectedApplicationId,
                boundaryScope: 'ALL'
              })
        }
        onClose={() => {
          close();

          if (location?.pathname === alertsTabListFullyQualified || location?.pathname === alertsList) {
            refreshSmartAlertConfigsList();
          }
        }}
      />
    );
  };

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

  return (
    <Button
      kind="primaryv2"
      icon="lib_openclose_add"
      onClick={isGlobal ? handleButtonClick : handleApplicationSelection}
      size="xl"
    >
      {buttonName}
    </Button>
  );
}
